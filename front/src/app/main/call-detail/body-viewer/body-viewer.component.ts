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

    constructor() {
    }

    ngOnChanges() {
        this.parsed = Querystring.parse(this.data);
    }
}
