import { Component, OnInit } from '@angular/core';
import {faUser, faUserCog} from "@fortawesome/free-solid-svg-icons";
import {LoginService} from "../login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  protected title: String = 'Midpoint';

  protected login: String = null;
  protected admin: boolean = null;

  protected faUser = faUser;
  protected faUserCog = faUserCog;

  constructor(private loginService: LoginService, private router: Router) {

  }

  async ngOnInit() {
    let token = await this.loginService.getLogin();
    if(!token) {
      this.router.navigateByUrl('/login');
    } else {
      this.login = token.login;
      this.admin = token.admin;
    }
  }

}
