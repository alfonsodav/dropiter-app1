import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SocialShareService } from '../services/social-share.service';
import { Notifications } from '../models/user';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  notifications;
  user;
  timeMilliseconds = this.auth.timeMilliseconds;
  constructor(private share: SocialShareService, private auth: AuthService) {
    this.getNotifications();
    this.auth.getUser().then(data => {
      console.log(data);
      this.user = data;
    });
    console.log(this.timeMilliseconds < new Date().getTime());
    console.log(this.timeMilliseconds);
    console.log(new Date().getTime());
  }
  difNotifications(data: [Notifications]) {
    localStorage.setItem('date', (new Date()).toString());
    const notifications = [];
    data.forEach(noti => {
      console.log(noti.date);
      noti.new = new Date(noti.date).getTime() >= this.timeMilliseconds;
      notifications.push(noti);
    });
    return notifications;
  }


  getNotifications() {
    this.share.getNotifications().then(data => {
      this.notifications = this.difNotifications(JSON.parse(data.data));
      console.log(data.data);
    }).catch(err => {
      console.log(err);
      console.log(JSON.stringify(err));
    });
  }
  chageState(noti) {
    noti.new = false;
    this.share.updateNotification(noti);
  }
}
