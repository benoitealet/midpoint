import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {LoginService} from "./login.service";
import {map} from 'rxjs/operators';


@Injectable()
export class HttpHeaderLoginUpdater implements HttpInterceptor {

    constructor(private loginService: LoginService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(map(event => {
            if (event instanceof HttpResponse) {
                const jwt = event.headers.get('x-update-auth');
                if (jwt) {
                    //console.log('Token updated: ', jwt);
                    const data = JSON.parse(jwt);
                    this.loginService.storeLogin(data);
                } else {
                    //console.log('Token NOT updated');
                }

            }
            return event;
        }));
    };


}