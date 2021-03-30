import {Injectable} from '@angular/core';
import {BasicService} from './basic.service';
import {HTTP} from '@ionic-native/http/ngx';
import {AuthService} from './auth.service';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BasicService {
  user: User;

  constructor(private nativeHTPP: HTTP, private auth: AuthService, private http: HttpClient) {
    super();
    this.auth.user$.subscribe(data => this.user = data);
  }
  getProductHttp(): Observable<any>{
    return this.http.get(`${this.baseUrl}/productos`).pipe(take(1));
  }
  getCatalogo(): Observable<any>{
    return this.http.get(`${this.baseUrl}/getcatalogodropinauta?id_dropinauta=1`);
  }
  removeCatalogo(id): Observable<any>{
    return this.http.delete(`${this.baseUrl}/CatalogoDropinauta/${id}`);
  }

  async getProductAll() {
    return await this.nativeHTPP.get(`${this.baseUrl}/productos`, {}, {}).then(data => JSON.parse(data.data))
      .catch(err => console.log('err product', JSON.stringify(err)));
  }

  async getProductsByCategory(idCat) {
    return await this.nativeHTPP.get(`${this.baseUrl}/productosbycategoria`, {id_categoria: idCat}, {})
      .then(data => JSON.parse(data.data))
      .catch(err => console.log('err product', JSON.stringify(err)));
  }

  async addToCatalogo(body): Promise<any> {
    return await this.nativeHTPP.post(`${this.baseUrl}/CatalogoDropinauta`, body, {}).then(data => data)
      .catch(err => console.log('err product', JSON.stringify(err)));
  }

  async getMyCatalogo() {
    console.log(String(this.user.id_Dropinauta));
    return await this.nativeHTPP.get(`${this.baseUrl}/getcatalogodropinauta`,
      {id_dropinauta: String(this.user.id_Dropinauta)}, {})
      .then(data => JSON.parse(data.data))
      .catch(err => console.log('err product', JSON.stringify(err)));
  }

  async updateCatalogo(body) {
    return await this.nativeHTPP.put(`${this.baseUrl}/CatalogoDropinauta/${body.id_Producto_Catalogo_Dropinauta}`, body, {});
  }

  async addCategory(body) {
    return await this.nativeHTPP.post(`${this.baseUrl}/CategoriaDropinauta`, body, {})
      .then(data => JSON.parse(data.data))
      .catch(err => console.log('err product', JSON.stringify(err)));
  }

  /* https://38.17.55.176/catalogo_dropiter/CatalogoDropinauta/catalogo?cd=aaaaaa */
}
