import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { BasicService } from './basic.service';
import {HTTP} from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocateService extends BasicService {
  user: User;
  constructor(private http: HttpClient, private auth: AuthService, private nativeHttp: HTTP) {
    super();
    this.auth.user$.subscribe(data => this.user = data);
  }

  getDepartament(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDepartamentos`);
  }
  getMyDepartament(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getDepartamentoById?id=${this.user.id_Departamento_FK}`);
  }
  getMyMunicipe(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Municipios/${this.user.id_Municipio_FK}`);
  }

  getMunicipes(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetmunicipiosByIdDepartamento?id_Departamento=${id}`);
  }
  getlistBank(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getBancos`);
  }
  getMyBank(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/Bancos/${id}`);
  }
  getMyDataBank(): Observable<any> {
    return this.http.get(`${this.baseUrl}/DropinautaBankData?id_Dropinauta=/${this.user.id_Dropinauta}`);
  }
  getlistBankActive(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getBancosActivos`);
  }
  getTipeBank(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getTipoCuentas`);
  }
  async saveDataBank(body): Promise<any>{
    console.log(body)
    return this.nativeHttp.post(`${this.baseUrl}/DropinautaBankData`, body, {});
  }
  updateDataBank(body): Observable<any>{
    return this.http.put(`${this.baseUrl}/DropinautaBankData/${body.id_Bank_Data}`, body);
  }

}
