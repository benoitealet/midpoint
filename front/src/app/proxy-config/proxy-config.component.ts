import {Component, OnInit} from '@angular/core';
import {Proxy} from "../proxy";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material";
import {ProxyAddPopupComponent} from "./proxy-add-popup/proxy-add-popup.component";
import {faTrash, faPlusCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-proxy-config',
    templateUrl: './proxy-config.component.html',
    styleUrls: ['./proxy-config.component.scss']
})
export class ProxyConfigComponent implements OnInit {

    faTrash = faTrash;
    faPlusCircle = faPlusCircle;
    displayedColumns: string[] = ['name', 'slug', 'owner', 'destination', 'delay', 'allowedTo', 'createdAt', 'actions'];
    proxies: Proxy[];
    loading: boolean = false;
    error: string = null;

    private login = null;
    private admin = null;

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router, private dialog: MatDialog) {
        this.proxies = [
            // {
            //     id: null,
            //     name: 'Hello',
            //     description: 'Hello world?',
            //     slug: 'hello_world',
            //     destination: 'http://labcms:3000',
            //     owner: 'admin',
            //     delay: 200,
            //     allowedTo: ['user1', 'user2']
            // }
        ];

    }

    async ngOnInit() {
        const loggedIn = (await this.loginService.isLogged());
        if (!loggedIn) {
            this.router.navigateByUrl('/login');
        } else {
            this.loadProxies();
        }

        let token = (await this.loginService.getLogin());
        this.login = token.login;
        this.admin = token.admin;
    }

    private async loadProxies() {
        const jwtToken = (await this.loginService.getJwtToken());

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': JSON.stringify(jwtToken)
            })

        };

        this.http.get(
            environment.backendUrl + '/proxyConfig/list',
            httpOptions
        ).subscribe((data: any) => {
            this.proxies = data;
            this.loading = false;
        }, error => {
            if (error.status === 403) {
                this.router.navigateByUrl('/login');
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });
    }


    canDeleteProxy(proxy) {
        return ((proxy.owner === this.login) || this.admin)
    }

    async deleteProxy(id) {
        const jwtToken = (await this.loginService.getJwtToken());

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': JSON.stringify(jwtToken)
            }),
            body: {
                id: id
            }
        };

        this.http.delete(
            environment.backendUrl + '/proxyConfig/proxy',
            httpOptions
        ).subscribe((data: any) => {
            this.loadProxies();
        }, error => {
            if (error.status === 403) {
                this.router.navigateByUrl('/login');
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });
    }

    showAddProxyModal() {


        const proxy = new Proxy();

        proxy.encoding = 'utf-8';

        const d = this.dialog.open(ProxyAddPopupComponent, {
            width: '600px',
            data: proxy
        });
        d.afterClosed().subscribe(async () => {
            this.loadProxies();
        });
    }

}
