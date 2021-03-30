import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Plugins } from '@capacitor/core';
import { User } from 'src/app/models/user';

const { Storage } = Plugins;


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User = {
    id_Dropinauta: 0,
    firt_Name: '',
    last_Name: '',
    photo_Profile: '',
    email: '',
    direction: '',
    pass: '',
    tefl: '',
    codigo_Catalogo: '',
    id_Departamento_FK: 0,
    id_Municipio_FK: 0,
    DepartamentoData: [],
    MunicipioData: []
  };
  profile;
  @Output() salida: EventEmitter<any> = new EventEmitter();

  constructor(private auth: AuthService) {
  }

  @Input() subtitle;

  ngOnInit() {
    this.getUserInfo();
    this.auth.user$.subscribe(data => {
      this.user = data;
      this.salida.emit(data);
    });
    console.log(this.user);
  }

  getUser(): void {
    this.auth.getUser().then(data => {
      this.user.firt_Name = data.firt_Name;
      this.user.last_Name = data.last_Name;
      this.user.email = data.email;
      console.log('user', JSON.stringify(this.user));
    });
  }

  async getUserInfo() {
    const { userId, token } = await Storage.get({ key: 'userToken' }).then(data => JSON.parse(data.value));
    console.log(userId, token);
    await this.auth.getFacebookData().then(data => {
      console.log('get facebook', JSON.stringify(data));
      this.profile = data.picture.data.url;
      this.user.email = data.email;
      this.user.firt_Name = data.first_name;
      this.user.last_Name = data.last_name;
      console.log(this.user);
    })
      .catch(err => console.log('error:', err));
  }
}
