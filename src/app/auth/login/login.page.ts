import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationExtras } from '@angular/router';
import { Plugins } from '@capacitor/core/';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { error } from 'protractor';

const { Storage, FacebookLogin } = Plugins;

// let _this: LoginPage;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  condiciones = false;
  email: string;

  constructor(private auth: AuthService,
    private router: Router,
    private toastIo: ToastController) {
  }

  ngOnInit() {
  }

  loginhttp(){
    this.auth.login(this.email).subscribe(data=> {
      console.log('logeado', data);
      this.router.navigate(['/dashboard']);
    }, err => {
      console.log('registrate', err);
      this.router.navigate(['/register']);
    })
  }

  async login(result) {
    const user = { token: result.accessToken.token, userId: result.accessToken.userId };
    await Storage.set({ key: 'userToken', value: JSON.stringify(user) });
    console.log(JSON.stringify(user));
    const inDropiter = await this.auth.syncToDropiter();
    console.log(inDropiter)
    if (inDropiter) {
      console.log('logeado');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('registrate');
      this.router.navigate(['/register']);
    }
  }
  async singIn() {
    const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];
    const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    console.log('result', JSON.stringify(result));
    const inDropiter = await this.auth.syncToDropiter();
    if (result && result.accessToken) {
      const user = { token: result.accessToken.token, userId: result.accessToken.userId };
      await Storage.set({ key: 'userToken', value: JSON.stringify(user) });
      if (inDropiter) {
        await this.auth.syncToDropiter();
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/register']);
      }
    } else {
      this.toastCreate('Perfil rechazado')
    }
  }

  async getCurrentState() {
    const result = await FacebookLogin.getCurrentAccessToken();
    console.log('result', JSON.stringify(result));
    const backup = await Storage.get({ key: 'userToken' }).then(data => JSON.parse(data.value));
    try {
      console.log(result);
      if (result && result.accessToken && backup.userId === result.accessToken.userId) {
        await this.login(result);
      } else {
        await this.singIn().catch(err => {
          console.log(JSON.stringify(err));
          this.toastCreate('Perfil rechazado');
        });
      }
    } catch (e) {
      /* registro y logueo por facebook*/
      await this.singIn().catch(err => {
        this.toastCreate('Perfil rechazado');
        console.log(err);
      });
    }
  }

  toastCreate(message): void {
    this.toastIo.create({
      header: 'Info',
      message,
      position: 'bottom',
    }).then(toast => toast.present);
  }
}
