import {Component, OnInit} from '@angular/core';
import {ProxyModel} from "../proxyModel";
import {CallModel} from "../callModel";
import {LoginService} from "../login.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {FormControl, Validators} from "@angular/forms";
import {MatPaginator} from "@angular/material";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    private login = null;
    private admin = null;

    displayedColumns: string[] = ['date', 'ipSource', 'requestVerb', 'requestUrl', 'responseStatus'];
    proxyList: ProxyModel[];
    callsList: CallModel[];
    error: string = null;

    proxySelectControl = new FormControl('', [Validators.required]);

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router) {
    }

    async ngOnInit() {
        const loggedIn = (await this.loginService.isLogged());
        let token = (await this.loginService.getLogin());
        this.login = token.login;
        this.admin = token.admin;

        if (!loggedIn) {
            this.router.navigateByUrl('/login');
        } else {
            this.loadProxyList();
        }
    }

    private async loadProxyList() {
        const jwtToken = (await this.loginService.getJwtToken());

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': JSON.stringify(jwtToken)
            })
        };

        this.http.get(
            environment.backendUrl + '/proxyList/list',
            httpOptions
        ).subscribe((data: any) => {
            this.proxyList = data;
        }, error => {
            if (error.status === 403) {
                this.router.navigateByUrl('/login');
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });
    }


    async updateCallsList(proxy) {

        this.callsList = null;

        const jwtToken = (await this.loginService.getJwtToken());

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': JSON.stringify(jwtToken)
            })

        };

        this.http.get(
            environment.backendUrl + '/proxyList/calls/' + proxy.id,
            httpOptions
        ).subscribe((data: any) => {
            this.callsList = data;
        }, error => {
            if (error.status === 403) {
                this.router.navigateByUrl('/login');
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });

    }
}
