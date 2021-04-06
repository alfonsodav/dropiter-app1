import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasicService } from './basic.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core/';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
const { Camera } = Plugins;

const { Storage, FacebookLogin } = Plugins;

export interface Photo {
  filepath: string;
  webviewPath: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BasicService {
  user$ = new BehaviorSubject<any>(null);
  email = '';
  timeMilliseconds = new Date(localStorage.getItem('date')).getTime();

  constructor(private ionicAlert: AlertController, private http: HttpClient,
    public router: Router, private nativeHTPP: HTTP, private toastIo: ToastController) {
    super();
  }

  login(email: string): Observable<any> {
    console.log('logueando', email);
    if (!email) {
      alert('correo requerido');
    }
    return this.http.get(`${this.baseUrl}/Dropinautas?email=${email}`);
  }

  async registerUser(body): Promise<any> {
    console.log(JSON.stringify(body));
    return await this.nativeHTPP.post(`${this.baseUrl}/Dropinautas`, body, {}).then(data => JSON.parse(data.data));
  }

  async getUser() {
    const { value } = await Storage.get({ key: 'user' });
    console.log(value);
    return JSON.parse(value);
  }

  async getBackup() {
    const { value } = await Storage.get({ key: 'backup' });
    return JSON.parse(value);
  }

  async updateUser(user) {
    console.log(JSON.stringify(user));
    if (user.photo_Profile && user.photo_Profile.length < 10) {
      user.photo_Profile = '';
    }
    try {
      await this.nativeHTPP.put(`${this.baseUrl}/Dropinautas/${user.id_Dropinauta}`, user, {}).catch(err => {
        throw new Error('Error actualizando usuario ' + JSON.stringify(err));
      });
      Storage.set({
        key: 'user',
        value: JSON.stringify(user)
      }).then(async () => await this.createCustomAlert('Datos actualizados correctamente'));
      await Storage.set({ key: 'backup', value: JSON.stringify(user) });
    } catch (error) {
      console.log(error);
    }
  }

  async getFacebookData() {
    return await FacebookLogin.getProfile({ fields: ['email', 'first_name', 'last_name', 'picture', 'installed'] });
  }

  async syncToDropiter() {
    let email = '';
    await this.getFacebookData().then(data => {
      console.log('get facebook', data);
      email = data.email;
      console.log(email);
    }).catch(err => console.log('error:', err));

    return this.nativeHTPP.get(`${this.baseUrl}/Dropinautas?email=${email}`, {}, {}).then(data => {
      this.user$.next({ ...JSON.parse(data.data) });
      Storage.set({ key: 'user', value: data.data });
      return true;
    }).catch(err => {
      console.log(JSON.stringify(err));
      return false;
    });
  }

  endSession() {
    Storage.remove({ key: 'user' }).catch(err => console.log(err));
    this.signOutFacebook();
  }

  deleteSession() {
    Storage.clear().catch(err => console.log(err));
    this.signOutFacebook();
  }

  async signOutFacebook(): Promise<void> {
    await Plugins.FacebookLogin.logout();
    this.router.navigate(['/']);
  }
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
      quality: 80,
    });

    return capturedPhoto.base64String;
  }

  private async createCustomAlert(messages: string) {
    const myAlert = await this.ionicAlert.create({
      message: messages,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    return myAlert.present();
  }

  public toastCreate(message): void {
    this.toastIo.create({
      header: 'Info',
      message,
      position: 'bottom',
      duration: 2000
    }).then(toast => toast.present);
  }
}
