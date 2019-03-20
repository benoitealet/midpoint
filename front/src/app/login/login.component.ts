import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    error: string = null;

    protected loginForm = new FormGroup({
        login: new FormControl('', Validators.minLength(8)),
        password: new FormControl(''),
    });

    constructor(private http: HttpClient, private loginService: LoginService, private router: Router) {
    }

    onSubmit(): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
console.log('query:', environment.backendUrl + '/doLogin');
        this.http.post(
            environment.backendUrl + '/doLogin',
            JSON.stringify(this.loginForm.value),
            httpOptions
        ).subscribe((data: any) => {
            console.log(data);
            if (data.error) {
                console.log(data.error);
                this.error = data.error;
            } else {
                this.error = null;

                this.loginService.storeLogin({
                    jwtToken: data.token,
                    login: this.loginForm.get('login').value
                });

                this.router.navigateByUrl('/');

            }

        }, error => {
            this.error = 'Une erreur inconnue est survenue';
            console.log(error);
        });
    }

    ngOnInit() {
    }

}
