import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class LoginService {


    constructor(protected localStorage: LocalStorage) {
    }

    storeLogin(data): void {
        this.localStorage.setItem('auth', data).subscribe(() => {
            console.log('stored');
        });
    }

    getLogin(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.localStorage.getItem('auth').subscribe((authData: any) => {
                const jwtHelper = new JwtHelperService();
                resolve(jwtHelper.decodeToken(authData.jwtToken));
            });
        });

    }

    getJwtToken(): Promise<object> {
        return new Promise((resolve, reject) => {
            this.localStorage.getItem('auth').subscribe((authData: any) => {
                resolve({
                    login: authData.login,
                    jwtToken: authData.jwtToken
                });
            });
        });
    }

    isLogged(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.localStorage.getItem('auth').subscribe((authData: any) => {
                if (!authData) {
                    resolve(false);
                } else {
                    const jwtHelper = new JwtHelperService();
                    resolve(!jwtHelper.isTokenExpired(authData.jwtToken));
                }

            });
        });
    }


}

