import { Injectable } from '@angular/core';
import {Plugins} from '@capacitor/core';
const {Storage} = Plugins;

export interface RequestOptions {
  headers?: {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  'Content-Type'?: 'application/json';
}

@Injectable({
  providedIn: 'root'
})
export class BasicService {
  baseUrl = 'http://38.17.55.89/dropiter_api/api';
  constructor() { }

  get authOptions(): RequestOptions {
    return {
      headers: this.authHeaders
    };
  }

  get authHeaders(): { [name: string]: string } {
    return {
      Authorization: 'Bearer ' + '2342343'
    };
  }

  get refreshHeaders(): { [name: string]: string } {
    return {
      Authorization: 'Bearer' + Storage.get({key: 'token'})
    };
  }
  getNativeHeaders = {
    Authorization: 'Bearer token',
    'Content-Type': 'application/json'
  };
}
