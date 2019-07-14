import {Component, OnInit, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ProxyModel} from "../../proxyModel";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginService} from "../../login.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-proxy-add-popup',
    templateUrl: './proxy-add-popup.component.html',
    styleUrls: ['./proxy-add-popup.component.scss']
})
export class ProxyAddPopupComponent implements OnInit {

    error: string = null;
    errors: string[] = null;

    submitted = false;

    formNewProxy: FormGroup;

    availableEncodings: string[] = [
        'utf-8',
        'ascii',
        'latin1'
    ];

    constructor(
        public dialogRef: MatDialogRef<ProxyAddPopupComponent>,
        private http: HttpClient,
        private loginService: LoginService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: ProxyModel) {
        this.formNewProxy = new FormGroup({
            id: new FormControl(data.id, []),
            name: new FormControl(data.name, [Validators.required]),
            encoding: new FormControl(data.encoding, [Validators.required]),
            description: new FormControl(data.description, [Validators.required]),
            slug: new FormControl(data.slug, [Validators.required]),
            destination: new FormControl(data.destination, [Validators.required]),
            owner: new FormControl(data.owner, [Validators.required]),
            delay: new FormControl(data.delay, [Validators.required]),
            allowedTo: new FormControl(data.allowedTo, []),
        });

    }

    ngOnInit() {
    }

    async onSubmitPopup() {
        this.submitted = true;
        if (!this.formNewProxy.invalid) {
            this.submitted = true;

            let data: any = {};
            data.id = this.formNewProxy.get('id').value;
            data.name = this.formNewProxy.get('name').value;
            data.encoding = this.formNewProxy.get('encoding').value;
            data.description = this.formNewProxy.get('description').value;
            data.slug = this.formNewProxy.get('slug').value;
            data.destination = this.formNewProxy.get('destination').value;
            data.owner = this.formNewProxy.get('owner').value;
            data.delay = this.formNewProxy.get('delay').value;
            data.allowedTo = this.formNewProxy.get('allowedTo').value;


            const jwtToken = (await this.loginService.getJwtToken());

            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': JSON.stringify(jwtToken)
                })

            };

            // Pousse dans la liste
            this.http[data.id?'patch':'put'](
                environment.backendUrl + '/proxyConfig/proxy',
                data,
                httpOptions
            ).subscribe((data: any) => {
                if(data.success == true) {
                    this.error = null;
                    this.errors = null;
                    this.dialogRef.close();
                } else {
                    this.error = 'Some validation errors occured:';
                    this.errors = data.errors;
                }

            }, error => {
                if (error.status === 403) {
                    this.router.navigateByUrl('/login', { skipLocationChange: true });
                } else {
                    this.error = 'An unknown error occured';
                    this.errors = null;
                }
            });




        } else {
            this.error = 'Form is invalid';
            this.errors = null;
        }
    }

}
