import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from './main/main.component';
import {ProxyConfigComponent} from './proxy-config/proxy-config.component';
import {ProxyAddPopupComponent} from './proxy-config/proxy-add-popup/proxy-add-popup.component';
import {MatDialogModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {MomentModule} from 'ngx-moment';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainComponent,
        ProxyConfigComponent,
        ProxyAddPopupComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MomentModule,
        FontAwesomeModule
    ],
    entryComponents: [
        ProxyAddPopupComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
