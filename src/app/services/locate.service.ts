import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Plugins} from '@capacitor/core';
import { Observable } from 'rxjs';
import { BasicService } from './basic.service';

const {Geolocation} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class LocateService extends BasicService {

  constructor(private http: HttpClient ) {
    super()
   }

  async getCurrentPosition() {
    const {coords} = await Geolocation.getCurrentPosition().catch(err => {
      console.log(err);
      return {
        coords: {
          latitude: 0,
          longitude: 0
        }
      };
    });
    console.log('Current', coords);
    return coords;
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    });
  }
  getDepartament(): Observable<any>{
    return this.http.get(`${this.baseUrl}/getDepartamentos`);
  }
  getMunicipes(id): Observable<any>{
    return this.http.get(`${this.baseUrl}/GetmunicipiosByIdDepartamento?id_Departamento=${id}`);
  }
}
