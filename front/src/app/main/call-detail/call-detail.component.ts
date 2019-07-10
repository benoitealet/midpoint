import {Component, Input, OnInit} from '@angular/core';
import {CallModel} from "../../callModel";
import {ProxyModel} from "../../proxyModel";

@Component({
    selector: 'call-detail',
    templateUrl: './call-detail.component.html',
    styleUrls: ['./call-detail.component.scss']
})
export class CallDetailComponent implements OnInit {

    displayCall: CallModel = null;
    displayProxy: ProxyModel = null;

    constructor() {
    }

    ngOnInit() {
    }

    @Input()
    set call(call: CallModel) {
        console.log('prev value: ', this.displayCall);
        console.log('got call: ', call);
        this.displayCall = call;
    }

    @Input()
    set proxy(proxy: ProxyModel|null) {
        console.log('prev value: ', this.displayProxy);
        console.log('got proxy: ', proxy);
        this.displayProxy = proxy;
    }
}
