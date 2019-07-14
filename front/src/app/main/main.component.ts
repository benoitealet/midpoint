import {Component, OnInit} from '@angular/core';
import {ProxyModel} from "../proxyModel";
import {CallModel} from "../callModel";
import {LoginService} from "../login.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {FormControl, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    private login = null;
    private admin = null;

    private ws:WebSocket = null;

    displayedColumns: string[] = ['date', 'ipSource', 'requestVerb', 'requestUrl', 'responseStatus'];
    proxyList: ProxyModel[];
    callsDataSource = new MatTableDataSource<CallModel>();
    error: string = null;

    selectedCallRow: CallModel = null;

    proxySelectControl = new FormControl('', [Validators.required]);

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router) {
    }

    async ngOnInit() {
        let token = (await this.loginService.getLogin());
        if (!token) {
            this.router.navigateByUrl('/login');
        } else {
            this.login = token.login;
            this.admin = token.admin;
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
                this.error = 'Unknown error occured';
                console.log(error);
            }
        });
    }


    async updateCallsList(proxy) {
        if(this.ws) {
            console.log('Close last ws');
            this.ws.close();
        }

        if (proxy && proxy.id) {
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
                this.callsDataSource.data = data;
            }, error => {
                if (error.status === 403) {
                    this.router.navigateByUrl('/login');
                } else {
                    this.error = 'Unknown error occured';
                    console.log(error);
                }
            });

            //prepare websocket
            console.log('Listen WS on ', 'ws://localhost:8080/ws/proxy/' + proxy.id);

            this.ws = new WebSocket('ws://localhost:8080/ws/proxy/' + proxy.id);

            this.ws.onopen = (evOpen: Event) => {
                this.ws.onmessage = (ev: MessageEvent) => {
                    const data = JSON.parse(ev.data);
                    if(data.type == 'call') {
                        const viewData = this.callsDataSource.data;
                        viewData.unshift(data.call);
                        this.callsDataSource.data = viewData;
                    }
                };

                this.ws.send(JSON.stringify({
                    auth: jwtToken
                }));
            };
        }
    }

    selectCall(row) {
        if(this.selectedCallRow == row) {
            this.selectedCallRow = null;
        } else {
            this.selectedCallRow = row;
        }
    }
}
