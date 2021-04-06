import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LocateService } from '../services/locate.service';
import { User } from '../models/user';
import { ModalController } from '@ionic/angular';
import { BankComponent } from '../share/modals/bank/bank.component';

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
    phone: '',
    photo_Profile: '',
    email: '',
    direction: '',
    id_Departamento_FK: 2,
    id_Municipio_FK: 10,
    pass: '123123',
    codigo_Catalogo: '',
    DepartamentoData: [],
    MunicipioData: []
  };
  municipios;
  departamentos;
  bank;

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
    const {photo_Profile,...body} = this.user
    this.auth.updateUser(body);
  }

  endSession() {
    this.auth.endSession();
    this.router.navigate(['/']).catch(err => console.log(err));
  }
  deleteSession() {
    this.auth.deleteSession();
    this.router.navigate(['/']).catch(err => console.log(err));
  }
  async modalBank() {
    const myModal = await this.modalIo.create({
      component: BankComponent,
      backdropDismiss: true,
      componentProps: {Id: this.user.id_Dropinauta},
      mode: 'ios',
      showBackdrop: true,
      cssClass: 'my-custom-modal',
      swipeToClose: true,
    });

    await myModal.present();
    const { data } = await myModal.onWillDismiss();
    this.bank = data;
    console.log(this.bank);
  }
  async imageProfile() {
    this.user.photo_Profile = await this.auth.addNewToGallery();
    console.log(this.user.photo_Profile);
  }
  completo() {
    const localUser = this.user;
    let invalido: boolean;
    invalido = !(localUser.id_Municipio_FK && localUser.id_Departamento_FK && localUser.direction && localUser.email);
    return invalido;
  }


}
