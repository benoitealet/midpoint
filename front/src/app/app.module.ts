import {BrowserModule} from '@angular/platform-browser';
import {Inject, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from './main/main.component';
import {ProxyConfigComponent} from './proxy-config/proxy-config.component';
import {ProxyAddPopupComponent} from './proxy-config/proxy-add-popup/proxy-add-popup.component';
import {
    MatButtonModule, MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule, MatInputModule,
    MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule,
    MatToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {MomentModule} from 'ngx-moment';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NavigationComponent} from './navigation/navigation.component';
import {CdkColumnDef, CdkTableModule} from "@angular/cdk/table";
import {CallDetailComponent} from './main/call-detail/call-detail.component';
import {JsonViewerComponent} from "./main/call-detail/json-viewer/json-viewer.component";
import {BodyViewerComponent} from "./main/call-detail/body-viewer/body-viewer.component";
import {HeaderViewerComponent} from "./main/call-detail/header-viewer/header-viewer.component";
import {DOCUMENT} from "@angular/common";
import {environment} from "../environments/environment";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainComponent,
        ProxyConfigComponent,
        ProxyAddPopupComponent,
        NavigationComponent,
        CallDetailComponent,
        JsonViewerComponent,
        BodyViewerComponent,
        HeaderViewerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatCardModule,
        BrowserAnimationsModule,
        MomentModule,
        FontAwesomeModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTabsModule,
        MatTableModule,
        CdkTableModule,
    ],
    entryComponents: [
        ProxyAddPopupComponent
    ],
    providers: [CdkColumnDef],
    bootstrap: [AppComponent]
})
export class AppModule {


}
