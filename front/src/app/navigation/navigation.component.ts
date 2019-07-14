import {Component, OnInit} from '@angular/core';
import {faUser, faUserCog, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    title: String = 'Midpoint';

    login: String = null;
    admin: boolean = null;

    protected faUser = faUser;
    protected faUserCog = faUserCog;
    protected faSignOutAlt = faSignOutAlt;

    constructor(private loginService: LoginService, private router: Router) {

    }

    async updateLogin(token) {
        if (!token) {
            this.login = null;
            this.admin = null;
        } else {
            this.login = token.login;
            this.admin = token.admin;
        }
    }

    signout() {
        this.loginService.logout();
    }

    async ngOnInit() {
        let token = await this.loginService.getLogin();
        this.updateLogin(token);
        this.loginService.onChange((token) => {
            this.updateLogin(token);
        })
    }

}
