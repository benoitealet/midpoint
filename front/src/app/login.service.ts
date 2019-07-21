import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private listeners: Array<Function> = [];

    constructor(protected localStorage: LocalStorage, private router: Router) {
    }

    storeLogin(data): void {
        //console.log('Store data', data);
        this.localStorage.setItem('auth', data).subscribe(() => {
            const jwtHelper = new JwtHelperService();
            this.listeners.forEach((f: Function) => {
                f(jwtHelper.decodeToken(data.jwtToken));
            });
        });
    }



    logout(): void {
        this.localStorage.removeItem('auth').subscribe(() => {
            this.router.navigateByUrl('/login', { skipLocationChange: true });
            this.listeners.forEach((f: Function) => {
                f(null);
            });
        });
    }

    getLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.localStorage.getItem('auth').subscribe((authData: any) => {
                if(authData) {
                    const jwtHelper = new JwtHelperService();
                    resolve(jwtHelper.decodeToken(authData.jwtToken));
                } else {
                    resolve(null);
                }
            });
        });

    }

    getJwtToken(): Promise<object> {
        return new Promise((resolve, reject) => {
            this.localStorage.getItem('auth').subscribe((authData: any) => {
                if(authData) {
                    resolve({
                        login: authData.login,
                        jwtToken: authData.jwtToken,
                    });
                } else {
                    resolve(null);
                }

            });
        });
    }

    onChange(f: Function) {
        this.listeners.push(f);
    }
}

