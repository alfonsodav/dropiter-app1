import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'upload' | 'download';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private username = 'usuario';
  private password = 'contrasena';
  constructor(
    private nativeHttp: HTTP,
    private platform: Platform,
  ) { }
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = btoa(this.username + ':' + this.password);
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + token) });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/x-www-form-urlencoded') }); // application/json
    }

    request = request.clone({ headers: request.headers.set('Accept', '*/*') }); // application/json
    request = request.clone({ headers: request.headers.set('Access-Control-Allow-Headers', 'Authorization, Expires, Pragma, DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range') });


    if (!this.platform.is('cordova')) { return next.handle(request); }

    return from(this.handleNativeRequest(request));
  }

  private async handleNativeRequest(request: HttpRequest<any>): Promise<HttpResponse<any>> {
    const headerKeys = request.headers.keys();
    const headers = {};

    headerKeys.forEach((key) => {
      headers[key] = request.headers.get(key);
    });

    try {
      await this.platform.ready();

      const method = request.method.toLowerCase() as HttpMethod;

      const nativeHttpResponse = await this.nativeHttp.sendRequest(request.url, {
        method,
        data: request.body,
        headers,
        serializer: 'json',
      });

      let body;

      try {
        body = JSON.parse(nativeHttpResponse.data);
      } catch (error) {
        body = { response: nativeHttpResponse.data };
      }

      const response = new HttpResponse({
        body,
        status: nativeHttpResponse.status,
        headers: request.headers, // nativeHttpResponse.headers,
        url: nativeHttpResponse.url,
      });

      return Promise.resolve(response);
    } catch (error) {
      if (!error.status) { return Promise.reject(error); }

      const response = new HttpResponse({
        body: JSON.parse(error.error),
        status: error.status,
        headers: error.headers,
        url: error.url,
      });

      return Promise.reject(response);
    }
  }
}

