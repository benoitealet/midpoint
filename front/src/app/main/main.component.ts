import {Component, OnInit} from '@angular/core';
import {ProxyModel} from "../proxyModel";
import {CallModel} from "../callModel";
import {LoginService} from "../login.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Event, NavigationStart, Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {FormControl, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material";
import {Location} from "@angular/common";

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    private login = null;
    private admin = null;

    private ws: WebSocket = null;

    displayedColumns: string[] = ['date', 'ipSource', 'requestVerb', 'requestUrl', 'responseStatus', 'time'];
    proxyList: ProxyModel[];
    callsDataSource = new MatTableDataSource<CallModel>();
    error: string = null;
    disconnected: boolean = false; // start as if we are connected, to avoid showing the popup during init
    selectedCallRow: CallModel = null;
    currentProxy: number = null;
    proxySelectControl = new FormControl('', [Validators.required]);

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router, private location: Location) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                if (this.ws) {
                    this.ws.close(1000, "Deliberate disconnection");
                    this.ws = null;
                }
            }
        });

    }

    async ngOnInit() {
        let token = (await this.loginService.getLogin());
        if (!token) {
            this.router.navigateByUrl('/login', {skipLocationChange: true});
        } else {
            this.login = token.login;
            this.admin = token.admin;
            this.loadProxyList();
            this.disconnected = false;
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
                this.router.navigateByUrl('/login', {skipLocationChange: true});
            } else {
                this.error = 'Unknown error occured';
                console.log(error);
            }
        });
    }


    async updateCallsList(proxy) {
        //console.log('updateCallsList', proxy);

        if (this.ws) {
            //console.log('Close last ws because of select change (to ' + proxy + ')');
            this.ws.close(1000, "Deliberate disconnection");
            this.ws = null;
        }
        this.disconnected = false;
        this.callsDataSource.data = [];
        if (proxy && proxy.id) {
            this.currentProxy = proxy;
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
                    this.router.navigateByUrl('/login', {skipLocationChange: true});
                } else {
                    this.error = 'Unknown error occured';
                    console.log(error);
                }
            });

            let wsScheme = 'ws:';
            if(location.protocol == 'https:') {
                wsScheme = 'wss:';
            }

            //prepare websocket
            const wsurl = wsScheme + environment.backendUrl + '/ws/proxy/' + proxy.id;
            //console.log('Listen WS on ', wsurl);

            this.ws = new WebSocket(wsurl);

            this.ws.onerror = (ev: ErrorEvent): any => {
                //console.log('Connection refused');
                this.disconnected = true;
            };

            this.ws.onopen = () => {
                //console.log('WS is now opened: ', wsurl);
                this.ws.onmessage = (ev: MessageEvent) => {
                    const data = JSON.parse(ev.data);
                    if (data.type == 'call') {
                        const viewData = this.callsDataSource.data;
                        let found = false;
                        for(let i = 0; i < viewData.length; i++) {
                            if(viewData[i].id === data.call.id) {
                                viewData[i] = data.call;
                                found = true;

                                if(this.selectedCallRow && this.selectedCallRow.id === data.call.id) {
                                    // force update selected row, will trigger headers tab reload
                                    this.selectedCallRow = null;
                                    this.selectedCallRow = data.call;
                                }
                            }
                        }
                        if(!found) {
                            viewData.unshift(data.call);
                        }
                        this.callsDataSource.data = viewData;
                    } else if (data.type == 'clean') {
                        let viewData = this.callsDataSource.data;
                        viewData = viewData.filter(r => {
                            return !data.list.includes(r.id);
                        });
                        if (this.selectedCallRow && this.selectedCallRow.id && data.list.includes(this.selectedCallRow.id)) {
                            this.selectedCallRow = null;
                        }
                        this.callsDataSource.data = viewData;

                    } else if (data.type == 'jwtRenew') {
                        this.loginService.storeLogin(data.newToken);
                    }
                };

                this.ws.send(JSON.stringify({
                    auth: jwtToken
                }));

                const keepAliveTimeout = setInterval(() => {
                    this.ws.send(JSON.stringify({
                        keepalive: ""
                    }));
                }, 10000);

                this.ws.onclose = (ev: CloseEvent): any => {
                    clearTimeout(keepAliveTimeout);
                    if(ev.code != 1000) {
                        this.disconnected = true;
                    }
                };
            };


        }
    }

    selectCall(row) {
        if (this.selectedCallRow == row) {
            this.selectedCallRow = null;
        } else {
            this.selectedCallRow = row;
        }
    }
}
