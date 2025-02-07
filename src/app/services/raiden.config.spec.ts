import { fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { RaidenConfig, Web3Factory } from './raiden.config';
import { HttpClientModule } from '@angular/common/http';
import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { SharedService } from './shared.service';
import { EnvironmentType } from './enviroment-type.enum';
import Web3 from 'web3';
import { HttpProvider } from 'web3-providers/types';
import Spy = jasmine.Spy;

describe('RaidenConfig', () => {
    let testingController: HttpTestingController;
    let raidenConfig: RaidenConfig;
    let sharedService: SharedService;
    let tracking: { current: number; failed: number[] };
    let httpProvider: HttpProvider;
    let send: Spy;
    let create: Spy;

    const url = 'http://localhost:5001/assets/config/config.production.json';

    let configuration: {
        settle_timeout: number;
        raiden: string;
        web3: string;
        reveal_timeout: number;
        environment_type: string;
    };

    beforeEach(() => {
        configuration = {
            raiden: 'http://localhost:5001/api/v1',
            reveal_timeout: 20,
            settle_timeout: 600,
            web3: 'http://localhost:8485',
            environment_type: 'production'
        };

        tracking = {
            failed: [],
            current: 0
        };

        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [RaidenConfig, SharedService, Web3Factory]
        });

        const web3Factory: Web3Factory = TestBed.get(Web3Factory);
        const fake = async (method: string): Promise<object> => {
            if (method !== 'net_version') {
                throw new Error('not mocked');
            }

            const failed = tracking.failed;
            const current = tracking.current;

            if (failed.findIndex(value => value === current) >= 0) {
                throw new Error(`Connection error: Timeout exceeded`);
            } else {
                // @ts-ignore
                return 1;
            }
        };

        create = spyOn(web3Factory, 'create').and.callFake(
            (provider: HttpProvider) => {
                httpProvider = provider;
                tracking.current++;
                send = spyOn(provider, 'send').and.callFake(fake);
                return new Web3(provider);
            }
        );

        testingController = TestBed.get(HttpTestingController);
        raidenConfig = TestBed.get(RaidenConfig);

        sharedService = TestBed.get(SharedService);
    });

    it('should be created', inject([RaidenConfig], (service: RaidenConfig) => {
        expect(service).toBeTruthy();
    }));

    it('should translate a relative path url to absolute path', fakeAsync(function() {
        configuration.web3 = '/web3';
        raidenConfig
            .load(url)
            .then(value => {
                expect(value).toBe(true);
            })
            .catch(e => {
                console.error(e);
                fail('it should not fail');
            });

        testingController
            .expectOne({
                url: url,
                method: 'GET'
            })
            .flush(configuration, {
                status: 200,
                statusText: ''
            });

        tick();

        expect(raidenConfig.config.web3).toBe('/web3');
        expect(httpProvider.host).toMatch('http://.*/web3');
        flush();
    }));

    it('should use the default configuration if loading fails', fakeAsync(function() {
        raidenConfig
            .load(url)
            .then(value => {
                expect(value).toBe(true);
            })
            .catch(e => {
                console.error(e);
                fail('it should not fail');
            });

        testingController
            .expectOne({
                url: url,
                method: 'GET'
            })
            .flush(
                {},
                {
                    status: 404,
                    statusText: ''
                }
            );

        tick();

        expect(raidenConfig.config).toEqual({
            raiden: '/api/1',
            web3: '/web3',
            web3_fallback: 'http://localhost:8545',
            poll_interval: 5000,
            block_start: 1603031,
            http_timeout: 600000,
            settle_timeout: 500,
            reveal_timeout: 10,
            environment_type: EnvironmentType.DEVELOPMENT
        });

        expect(sharedService.getStackTrace()).toBe(null);
        expect(tracking.current).toBe(2);
        flush();
    }));

    it('should merge the loaded configuration with the defaults', fakeAsync(function() {
        raidenConfig
            .load(url)
            .then(value => {
                expect(value).toBe(true);
            })
            .catch(e => {
                console.error(e);
                fail('it should not fail');
            });

        testingController
            .expectOne({
                url: url,
                method: 'GET'
            })
            .flush(configuration, {
                status: 200,
                statusText: ''
            });

        tick();

        expect(raidenConfig.config).toEqual({
            raiden: 'http://localhost:5001/api/v1',
            web3: 'http://localhost:8485',
            web3_fallback: 'http://localhost:8545',
            poll_interval: 5000,
            block_start: 1603031,
            http_timeout: 600000,
            settle_timeout: 600,
            reveal_timeout: 20,
            environment_type: EnvironmentType.PRODUCTION
        });

        expect(sharedService.getStackTrace()).toBe(null);
        expect(tracking.current).toBe(2);
    }));

    it('should fallback if the primary web3 endpoint fails', fakeAsync(function() {
        tracking.failed.push(1);

        raidenConfig
            .load(url)
            .then(value => {
                expect(value).toBe(true);
            })
            .catch(e => {
                console.error(e);
                fail('it should not fail');
            });

        testingController
            .expectOne({
                url: url,
                method: 'GET'
            })
            .flush(configuration, {
                status: 200,
                statusText: ''
            });

        tick();

        expect(sharedService.getStackTrace()).toBe(null);
        expect(tracking.current).toBe(2);
        expect(raidenConfig.config.web3).toBe(
            raidenConfig.config.web3_fallback
        );
    }));

    it('should return false and set error on the promise if both web3 endpoints fail', fakeAsync(function() {
        tracking.failed.push(1, 2);
        raidenConfig
            .load(url)
            .then(value => {
                expect(value).toBe(false);
            })
            .catch(e => {
                console.error(e);
                fail('it should not fail');
            });

        testingController
            .expectOne({
                url: url,
                method: 'GET'
            })
            .flush(configuration, {
                status: 200,
                statusText: ''
            });

        tick();

        expect(sharedService.getStackTrace()).toBeTruthy();
        expect(tracking.current).toBe(2);
        expect(raidenConfig.config.web3).toBe(
            raidenConfig.config.web3_fallback
        );
    }));
});
