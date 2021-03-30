import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable } from 'rxjs';
import { BasicService } from './basic.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends BasicService {

  constructor(private nativeHttp: HTTP, private http: HttpClient) {
    super()
  }
  getAllCategory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categorias`);
  }
  addCategoryToUser(body): Observable<any> {
    return this.http.post(`${this.baseUrl}/CategoriaDropinauta`, body);
  }
}
