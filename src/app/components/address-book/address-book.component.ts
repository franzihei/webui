import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { addressValidator } from '../../shared/address.validator';
import { Address, Addresses } from '../../models/address';
import { AddressBookService } from '../../services/address-book.service';
import { MatDialog, PageEvent } from '@angular/material';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import { IdenticonCacheService } from '../../services/identicon-cache.service';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogPayload
} from '../confirmation-dialog/confirmation-dialog.component';
import { flatMap, map } from 'rxjs/operators';
import { EMPTY, Observable, of } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { AddAddressDialogComponent } from '../add-address-dialog/add-address-dialog.component';

@Component({
    selector: 'app-address-book',
    templateUrl: './address-book.component.html',
    styleUrls: ['./address-book.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(+100%)'
                }),
                animate('0.2s ease-in')
            ]),
            transition('* => void', [
                animate(
                    '0.2s 0.1s ease-out',
                    style({
                        opacity: 0,
                        transform: 'translateX(100%)'
                    })
                )
            ])
        ])
    ]
})
export class AddressBookComponent implements OnInit {
    private _editedAddress: string;

    constructor(
        private fb: FormBuilder,
        private addressBookService: AddressBookService,
        private identiconService: IdenticonCacheService,
        public dialog: MatDialog,
        private mediaObserver: MediaObserver
    ) {}

    public readonly form: FormGroup = this.fb.group({
        address: ['', addressValidator()],
        label: ['']
    });

    visibleAddresses: Array<Address>;
    totalAddresses: number;
    pageSize = 10;
    currentPage = 0;

    get isMobile$(): Observable<boolean> {
        return this.mediaObserver.media$.pipe(
            map(change => {
                return change.mqAlias === 'xs';
            })
        );
    }

    get editedAddress(): string {
        return this._editedAddress;
    }

    // noinspection JSMethodCanBeStatic
    trackByFn(index, item: Address) {
        return item.address;
    }

    ngOnInit() {
        this.updateVisibleAddresses();
    }

    identicon(address: string) {
        return this.identiconService.getIdenticon(address);
    }

    private updateVisibleAddresses() {
        const addresses = this.addressBookService.getArray();
        this.totalAddresses = addresses.length;
        const start = this.pageSize * this.currentPage;
        this.visibleAddresses = addresses.slice(start, start + this.pageSize);
    }

    save() {
        const addressControl = this.form.get('address');
        const labelControl = this.form.get('label');
        const address: Address = {
            address: addressControl.value,
            label: labelControl.value
        };

        this.addressBookService.save(address);
        this.updateVisibleAddresses();
        addressControl.reset('');
        labelControl.reset('');
    }

    onPageEvent($event: PageEvent) {
        this.currentPage = $event.pageIndex;
        this.updateVisibleAddresses();
    }

    deleteAddress(address: Address) {
        this.addressBookService.delete(address);
        this.updateVisibleAddresses();
    }

    updateAddress(address: Address) {
        this.addressBookService.save(address);
    }

    saveAddresses() {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = this.addressBookService.createExportURL();
        link.setAttribute('visibility', 'hidden');
        link.setAttribute('download', 'address-book');
        link.dispatchEvent(new MouseEvent('click'));
    }

    openAddDialog() {
        const dialog = this.dialog.open(AddAddressDialogComponent);

        dialog.afterClosed().subscribe(value => {
            if (!value) {
                return;
            }

            this.addressBookService.save(value);
            this.updateVisibleAddresses();
        });
    }

    confirmDelete() {
        const payload: ConfirmationDialogPayload = {
            title: 'Delete Address Book',
            message:
                'This action will delete all your stored addresses. <br/> ' +
                'Unless you exported your Address book all your addresses will be lost. <br/>' +
                'Are you sure you want to continue?'
        };

        const dialog = this.dialog.open(ConfirmationDialogComponent, {
            data: payload
        });

        dialog
            .afterClosed()
            .pipe(
                flatMap(result => {
                    if (!result) {
                        return EMPTY;
                    }

                    return of(result);
                })
            )
            .subscribe(() => {
                this.addressBookService.deleteAll();
                this.updateVisibleAddresses();
            });
    }

    setEdited(address: string) {
        this._editedAddress = address;
    }

    cancelled() {
        this._editedAddress = undefined;
    }

    importAddresses(address: Addresses) {
        this.addressBookService.store(address, true);
        this.updateVisibleAddresses();
    }
}
