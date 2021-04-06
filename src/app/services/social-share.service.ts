import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';

const {Share} = Plugins;
import {HTTP} from '@ionic-native/http/ngx';
import {BasicService} from './basic.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocialShareService extends BasicService {

  constructor(private http: HTTP, private auth: AuthService) {
    super();
  }

  shareEmail() {
    Share.share({}).then(data => console.log(data));
  }

  async getNotificationsPerson() {
    const user = this.auth.user$.subscribe(data => {
      console.log(data);
      return user;
    });
    console.log(user);
    return await this.http.get(`${this.baseUrl}/NotificacionesPersonalesDropinautaByIdDropinauta`,
      {id_Dropinauta: String(user.id_Dropinauta)}, {});
  }

  async getNotifications() {
    const user = this.auth.user$.subscribe(data => {
      console.log(data);
      return user;
    });
    console.log(user);
    return await this.http.get(`${this.baseUrl}/getNotificaciones`,
      {id_Dropinauta: String(user.id_Dropinauta)}, {});
  }

  async updateNotification(body) {
    return await this.http.put(`${this.baseUrl}/NotificacionesDropinauta/${body.id_Notificacion_Dropinauta}`, body, {})
      .catch(err => {
        this.auth.toastCreate('no se pudo actualizar el estado de la notificación');
        console.log(JSON.stringify(err));
        console.log(err);
      });
  }
}
