import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Plugins, CameraResultType } from '@capacitor/core';
import { error } from 'protractor';
import { LocateService } from '../services/locate.service';
import { User } from '../models/user';
import { ModalController } from '@ionic/angular';
import { BankComponent } from '../share/modals/bank/bank.component';
const { Camera } = Plugins

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  options = ['Central', 'Provincial', 'Ahorro'];
  user: User = {
    id_Dropinauta: 0,
    firt_Name: '',
    last_Name: '',
    tefl: '',
    photo_Profile: '',
    email: '',
    direction: '',
    id_Departamento_FK: 0,
    id_Municipio_FK: 0,
    pass: '123123',
    codigo_Catalogo: '',
    DepartamentoData: [],
    MunicipioData: []
  };
  municipios;
  departamentos;

  constructor(private auth: AuthService, private router: Router, private locale: LocateService, 
    private modalIo: ModalController) {
    this.getDepartament();
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.auth.getUser().then(data => {
      console.log('perfil', data);
      console.log('tipo', typeof data);
      this.user = data;

    }).catch(err => console.log('perfil error', err));
  }
  getDepartament() {
    this.locale.getDepartament().subscribe(data => this.departamentos = data, err => console.log(err));
  }
  getMunicipes() {
    console.log(this.user);
    const id = this.user.id_Departamento_FK;
    this.locale.getMunicipes(id).subscribe(data => this.municipios = data, err => console.log(err));
  }

  saveChanges() {
    this.auth.updateUser(this.user);
  }

  endSession() {
    this.auth.endSession();
    this.router.navigate(['/']).catch(err => console.log(err));
  }
  deleteSession() {
    this.auth.deleteSession();
    this.router.navigate(['/']).catch(err => console.log(err));
  }
  async lector(event) {

    let file = event.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      const separate = String(reader.result).split(new RegExp(','));
      this.user.photo_Profile = separate[1]
      console.log(this.user.photo_Profile);
    }
    reader.readAsDataURL(file);
    console.log(this.user.photo_Profile);
  }
  async modalBank() {
    const myModal = await this.modalIo.create({
      component: BankComponent,
      backdropDismiss: true,
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'my-custom-modal',
      swipeToClose: true,
    });

    await myModal.present();
    const { data } = await myModal.onWillDismiss();
    // this.userTest.bank = data;
    console.log(this.user);
  }
  imageProfile() {
    const options = {
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      saveToGallery: true
    };
    console.log('subir imagen');
    Camera.getPhoto(options).then(data => {
      console.log(data);
      // this.user.photo_Profile = data.base64String;
    }).catch(err => {
      console.log('error foto:', JSON.stringify(err))
    })
  }
  completo() {
    const localUser = this.user
    let invalido = true;
    if (localUser.id_Municipio_FK && localUser.id_Departamento_FK && localUser.direction && localUser.email && localUser.pass
      && localUser.tefl) {
      invalido = false
    } else {
      invalido = true
    }
    return invalido;
  }


}
