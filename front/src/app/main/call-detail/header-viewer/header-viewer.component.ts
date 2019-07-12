import {Component, OnChanges, Input, ElementRef, ViewChild} from '@angular/core';
import {HeaderModel} from "../../../headerModel";


@Component({
    selector: 'header-viewer',
    templateUrl: './header-viewer.component.html',
    styleUrls: ['./header-viewer.component.scss']
})
export class HeaderViewerComponent implements OnChanges {

    @Input() data: Array<HeaderModel>;
    @Input() type: string;

    filtered: object = null;

    constructor() {
    }

    ngOnChanges() {
        this.filtered = this.data.filter((h) => h.type == this.type);
    }
}
