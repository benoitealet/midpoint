import {Component, OnChanges, Input, ElementRef, ViewChild} from '@angular/core';
import Querystring from 'querystring';

@Component({
    selector: 'body-viewer',
    templateUrl: './body-viewer.component.html',
    styleUrls: ['./body-viewer.component.scss']
})
export class BodyViewerComponent implements OnChanges {
    objectKeys = Object.keys;

    @Input() data: string;

    parsed: object = null;
    error: string;
    constructor() {
    }

    ngOnChanges() {
        try {
            this.parsed = Querystring.parse(this.data);
            this.error = null;
        } catch(e) {
            this.parsed = null;
            this.error = e.message;
        }
    }
}
