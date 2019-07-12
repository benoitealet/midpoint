import {Component, OnChanges, Input, ElementRef, ViewChild} from '@angular/core';
import JSONFormatter from 'json-formatter-js';

@Component({
    selector: 'json-viewer',
    template: `
        <div #jsonViewer></div>`,
    //styleUrls: ['./json-viewer.component.sass']
})
export class JsonViewerComponent implements OnChanges {
    @ViewChild(`jsonViewer`) input: ElementRef;

    @Input() json: Array<any> | Object | any;

    constructor() {
    }

    ngOnChanges() {
        // Do nothing without data
        try {
            let parsed = JSON.parse(this.json);

            if (!(parsed != null && typeof parsed === 'object') && !Array.isArray(parsed)) {
                return;
            }
            const formatter = new JSONFormatter(parsed);
            let fc = this.input.nativeElement.firstChild;
            while (fc) {
                this.input.nativeElement.removeChild(fc);
                fc = this.input.nativeElement.firstChild;
            }

            this.input.nativeElement.style.backgroundColor = ''
            this.input.nativeElement.style.color = '';
            this.input.nativeElement.appendChild(formatter.render());
        } catch(e) {
            this.input.nativeElement.style.backgroundColor = '#b52e31';
            this.input.nativeElement.style.color = 'white';
            this.input.nativeElement.innerHTML = e.message;
        }
    }
}
