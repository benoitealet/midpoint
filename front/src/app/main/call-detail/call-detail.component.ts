import {Component, Input, OnInit} from '@angular/core';
import {CallModel} from "../../callModel";
import {ProxyModel} from "../../proxyModel";
import JSONFormatter from 'json-formatter-js';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {LoginService} from "../../login.service";
import {Router} from "@angular/router";
import {HeaderModel} from "../../headerModel";

@Component({
    selector: 'call-detail',
    templateUrl: './call-detail.component.html',
    styleUrls: ['./call-detail.component.scss']
})
export class CallDetailComponent implements OnInit {

    displayCall: CallModel = null;
    displayProxy: ProxyModel = null;

    headers: Array<HeaderModel> = [];

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router) {
    }

    ngOnInit() {
    }

    @Input()
    set call(call: CallModel) {
        this.displayCall = call;
        this.updateHeaders(call);
    }

    @Input()
    set proxy(proxy: ProxyModel | null) {
        this.displayProxy = proxy;
    }


    renderJson(json): string {
        const formatter = new JSONFormatter(JSON.parse(json));
        return formatter.render();
    }

    async updateHeaders(http) {
        this.headers = [];
        if (http && http.id) {
            const jwtToken = (await this.loginService.getJwtToken());

            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': JSON.stringify(jwtToken)
                })

            };
            this.http.get(
                environment.backendUrl + '/proxyList/callHeaders/' + http.id,
                httpOptions
            ).subscribe((data: Array<HeaderModel>) => {
                this.headers = data;
            }, error => {
                if (error.status === 403) {
                    this.router.navigateByUrl('/login');
                } else {
                    console.log(error);
                }
            });
        }
    }
}
