import {Component, OnInit} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {ModalController} from '@ionic/angular';
import {ProductService} from '../services/product.service';
import {User} from '../models/user';
import {AddProductComponent} from '../share/modals/add-product/add-product.component';
import {AuthService} from '../services/auth.service';

const {Share, Browser} = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  baseCatalogo = 'https://38.17.55.176/catalogo_dropiter/CatalogoDropinauta/catalogo?cd=';
  product;
  myProduct = this.productService.Catalogo;
  user: User;

  constructor(private modal: ModalController, private productService: ProductService, private auth: AuthService) {
  }
  ngOnInit(){
    this.myProduct = this.productService.Catalogo;
    this.getProduct();
    this.auth.getUser().then(data => {
      console.log(JSON.stringify(data));
      this.user = data;
    });
    console.log(JSON.stringify(this.user));
    this.auth.toastCreate('Bienvenido');
  }


  async shareOption() {
    await Share.share({
      title: 'Catalogo',
      text: 'Compartir Catalogo',
      url: this.baseCatalogo + this.user.codigo_Catalogo
    }).catch(err => alert(JSON.stringify(err)));
  }

  async openCatalogo() {
    await Browser.open({url: this.baseCatalogo + this.user.codigo_Catalogo, toolbarColor: '#3B5998'});
  }

  async openModal(product) {
    console.log(product);
    const myModal = await this.modal.create({
      component: AddProductComponent,
      backdropDismiss: true,
      swipeToClose: true,
      componentProps: {product},
      showBackdrop: true,
      mode: 'ios',
    });
    await myModal.present();

    await myModal.onDidDismiss().then(data => console.log(data));
  }

  async getProduct() {
    await this.productService.getMyCatalogo();
    console.log(this.myProduct);
    const listIdMyproduct = this.myProduct.map(product => product.ProductoData.id_Producto_Negocio);
    await this.productService.getProductAll().catch(err => console.log('product:', err));
    const process = this.productService.Product.reduce((acc = [], pro) => {
      if (!listIdMyproduct.includes(pro.id_Producto_Negocio)) {
        acc.push(pro);
      }
      return acc;
    }, []);
    this.myProduct = [...this.productService.Catalogo];
    this.product = [...process];
  }
}

