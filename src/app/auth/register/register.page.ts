import { Component, OnInit } from '@angular/core';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { LocateService } from '../../services/locate.service';
import { BankComponent } from '../../share/modals/bank/bank.component';
import { AuthService } from '../../services/auth.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import {Category, Product} from 'src/app/models/product';
/*Capacitor*/
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  options = ['Central', 'Provincial', 'Ahorro'];
  view = 1;
  user = {
    firt_Name: '',
    last_Name: '',
    photo_Profile: '',
    email: '',
    direction: '',
    pass: '',
    tefl: '',
    id_Departamento_FK: 0,
    id_Municipio_FK: 0
  };
  categorias;
  profile = '';
  catSelect = [];
  municipios;
  departamentos;

  constructor(
    private locale: LocateService,
    private modalIo: ModalController,
    private auth: AuthService,
    private cat: CategoriasService) {
  }

  ngOnInit() {
    // this.auth.user$.subscribe(data => console.log(data));
    // this.auth.getUser().then(data => {
    //   console.log('register data login:', data);
    //   this.user = data;
    // });
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
      // this.user.photo_Profile =
      this.profile = data.picture.data.url;
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
  getDepartament() {
    this.locale.getDepartament().subscribe(data => this.departamentos = data, err => console.log(err));
  }
  getMunicipes() {
    console.log(this.user);
    const id = this.user.id_Departamento_FK;
    this.locale.getMunicipes(id).subscribe(data => this.municipios = data, err => console.log(err));
  }
  completo() {
    const localUser = this.user;
    let invalido = true;
    if (localUser.id_Municipio_FK && localUser.email && localUser.pass && localUser.id_Departamento_FK && localUser.direction
      && localUser.tefl) {
        invalido = false;
    } else {
      invalido =  true;
    }
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
    // this.userTest.bank = data;
    console.log(this.user);
  }

  async continue(action?: boolean) {
    this.view++;
    console.log(this.view);
    console.log(action);

    if (action) {
      console.log(this.user);
      this.auth.registerUser(this.user).subscribe(data => {
        Storage.set({ key: 'user', value: JSON.stringify(data) });
        Storage.set({ key: 'backup', value: JSON.stringify(data) });
        console.log(JSON.stringify(data));
        const user = data;
        this.auth.syncToDropiter();
        this.addCategory(user.id_Dropinauta);
        this.auth.toastCreate('Registro Completo');
        this.auth.router.navigate(['/dashboard']);
      }, err => {
        alert(JSON.stringify(err));
        this.view = 1;
      });
    }
  }
}
