import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocateService } from '../../services/locate.service';
import { BankComponent } from '../../share/modals/bank/bank.component';
import { AuthService } from '../../services/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import {Category} from 'src/app/models/product';
/*Capacitor*/
import { Plugins } from '@capacitor/core';
import { Buffer } from 'buffer';
const { Storage } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  view = 1;
  user = {
    firt_Name: '',
    last_Name: '',
    photo_Profile_B64: "",
    email: '',
    direction: '',
    pass: '',
    phone: '',
    id_Departamento_FK: 0,
    id_Municipio_FK: 0
  };
  categorias;
  profile = '';
  catSelect = [];
  municipios;
  departamentos;
  bank;

  constructor(
    private locale: LocateService,
    private modalIo: ModalController,
    private auth: AuthService,
    private cat: CategoriasService) {
  }

  ngOnInit() {
    this.getUserInfo();
    this.getCategory();
    this.auth.toastCreate('Perfil aceptado, completa tu registro');
    this.getDepartament();
  }

  async getUserInfo() {
    console.log('inicio registro');

    await this.auth.getFacebookData().then(data => {
      console.log('get facebook', JSON.stringify(data));
      this.user.firt_Name = data.first_name;
      this.user.last_Name = data.last_name;
      this.user.email = data.email;
      console.log(JSON.stringify(this.user));
    })
      .catch(err => console.log('error:', JSON.stringify(err)));
  }
  getCategory() {
    this.cat.getAllCategory().subscribe(data => {
      console.log(data);
      this.categorias = data;
    });
  }

  selectCategory(event, cat: Category) {
    console.log(cat.id_Categoria);
    if (this.catSelect.includes(cat.id_Categoria)){
      const index = this.catSelect.indexOf(cat.id_Categoria);
      this.catSelect.splice(index, 1);
    } else {
      this.catSelect.push(cat.id_Categoria);
    }
    console.log(this.catSelect);
    event.target.parentElement.classList.toggle('active');
  }

  async addCategory(idUser) {
    for (const cate of this.catSelect) {
      const select = {
        id_Admin_Categoria_Producto_FK: cate.id_Categoria,
        id_Dropinauta_FK: idUser
      };
      await this.cat.addCategoryToUser(select);
    }
  }
  registerDataBank(id){
    console.log(id)
    this.bank.id_Dropinauta_FK = id;
    console.log(this.bank);
    this.locale.saveDataBank(this.bank).then(data => console.log(data));
  }
  getDepartament() {
    this.locale.getDepartament().subscribe(data => this.departamentos = data, err => console.log(err));
  }
  getMunicipes() {
    console.log(this.user);
    const id = this.user.id_Departamento_FK;
    this.locale.getMunicipes(id).subscribe(data => this.municipios = data, err => console.log(err));
  }
  async imageProfile() {
    this.user.photo_Profile_B64 = await this.auth.addNewToGallery();
    this.profile = 'data:image/png;base64,' + this.user.photo_Profile_B64;
    console.log(this.user.photo_Profile_B64);
  }
  completo() {
    const localUser = this.user;
    let invalido: boolean;
    invalido = !(localUser.id_Municipio_FK && localUser.email && localUser.pass && localUser.id_Departamento_FK && localUser.direction
      && localUser.phone);
    return invalido;
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
    this.bank = data;
    console.log(this.bank);
  }

  async continue(action?: boolean) {
    this.view++;
    console.log(this.view);
    console.log(action);
    console.log(JSON.stringify(this.bank));
    if (action) {
      console.log(this.bank);
      try{
      console.log(JSON.stringify(this.user));
      const data = await this.auth.registerUser(this.user);
      if (data.id_Dropinauta && data.id_Dropinauta === 0) {
        throw new Error('Datos requeridos incompletos')
      } else {
        console.log(JSON.stringify(data));
        await this.auth.syncToDropiter();
        await this.registerDataBank(data.id_Dropinauta);
        await this.addCategory(data.id_Dropinauta);
        await this.auth.toastCreate('Registro Completo');
        this.auth.router.navigate(['/dashboard']);
      } 
      } catch( err)  {
        this.auth.toastCreate(JSON.stringify(err));
        this.view = 1;
      };
    }
  }
}
