import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Connection } from '../../models/connection';

@Component({
    selector: 'app-token-network-actions',
    templateUrl: './token-network-actions.component.html',
    styleUrls: ['./token-network-actions.component.css']
})
export class TokenNetworkActionsComponent implements OnInit {
    @Input() connection: Connection;
    @Output() openConnectionManagerDialog: EventEmitter<
        boolean
    > = new EventEmitter();
    @Output() openLeaveNetworkDialog: EventEmitter<
        boolean
    > = new EventEmitter();
    @Output() openPaymentDialog: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
