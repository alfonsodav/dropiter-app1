import {Component} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  profile: string;
  constructor(private auth: AuthService) {
    this.auth.user$.subscribe(data => {
      this.profile = 'data:image/png;base64,' + data.photo_Profile;
    });
  }
  async getUserInfo() {
    await this.auth.getUser().then(data => {
      this.profile = data.picture.data.url;
    })
      .catch(err => console.log('error:', JSON.stringify(err)));
  }
}
