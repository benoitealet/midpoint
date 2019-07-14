import {Component, OnInit} from '@angular/core';
import {ProxyModel} from "../proxyModel";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material";
import {ProxyAddPopupComponent} from "./proxy-add-popup/proxy-add-popup.component";
import {faTrash, faPlusCircle, faEdit} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-proxy-config',
    templateUrl: './proxy-config.component.html',
    styleUrls: ['./proxy-config.component.scss']
})
export class ProxyConfigComponent implements OnInit {

    faTrash = faTrash;
    faPlusCircle = faPlusCircle;
    faEdit = faEdit;

    displayedColumns: string[] = ['name', 'slug', 'owner', 'destination', 'delay', 'allowedTo', 'createdAt', 'lastUsageAt', 'actions'];
    proxies: ProxyModel[];
    loading: boolean = false;
    error: string = null;

    private login = null;
    private admin = null;

    constructor(private loginService: LoginService, private http: HttpClient, private router: Router, private dialog: MatDialog) {
        this.proxies = [];
    }

    async ngOnInit() {
        let token = (await this.loginService.getLogin());
        if (!token) {
            this.router.navigateByUrl('/login', { skipLocationChange: true });
        } else {
            this.loadProxies();
            this.login = token.login;
            this.admin = token.admin;
        }
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
                this.router.navigateByUrl('/login', { skipLocationChange: true });
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });
    }


    canDeleteProxy(proxy) {
        return ((proxy.owner === this.login) || this.admin)
    }
    canEditProxy(proxy) {
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
                this.router.navigateByUrl('/login', { skipLocationChange: true });
            } else {
                this.error = 'Une erreur inconnue est survenue';
                console.log(error);
            }
        });
    }

    showAddProxyModal() {


        const proxy = new ProxyModel();

        proxy.encoding = 'utf-8';

        const d = this.dialog.open(ProxyAddPopupComponent, {
            width: '600px',
            data: proxy
        });
        d.afterClosed().subscribe(async () => {
            this.loadProxies();
        });
    }

    showEditProxyModal(proxy) {

        const d = this.dialog.open(ProxyAddPopupComponent, {
            width: '600px',
            data: proxy
        });
        d.afterClosed().subscribe(async () => {
            this.loadProxies();
        });
    }

}
