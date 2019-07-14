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

    loginForm = new FormGroup({
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

        this.http.post(
            environment.backendUrl + '/doLogin',
            JSON.stringify(this.loginForm.value),
            httpOptions
        ).subscribe((data: any) => {
            if (data.error) {
                console.log(data.error);
                this.error = data.error;
            } else {
                this.error = null;

                this.loginService.storeLogin({
                    jwtToken: data.token,
                    login: this.loginForm.get('login').value
                });

                this.router.navigateByUrl('/', { skipLocationChange: true });

            }

        }, error => {
            if(error.error && error.error.message) {
                this.error = error.error.message;
            } else {
                this.error = 'Unexpected error';
            }
            console.log(error);
        });
    }

    ngOnInit() {
    }

}
