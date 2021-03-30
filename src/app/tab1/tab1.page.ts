import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { User } from '../models/user';
import { AddProductComponent } from '../share/modals/add-product/add-product.component';
import { AuthService } from '../services/auth.service';
const { Share, Browser } = Plugins;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  // providers: [SocialSharing]
})
export class Tab1Page {
  productTest = [
    {
      sales: '24',
      image: 'assets/images/shirt.png'
    },
    {
      sales: '2',
      image: 'assets/images/shirt2.png'
    },
    {
      sales: '30',
      image: 'assets/images/shoes.png'
    },
    {
      sales: '15',
      image: 'assets/images/handbag.png'
    }
  ];
  baseCatalogo = 'https://38.17.55.176/catalogo_dropiter/CatalogoDropinauta/catalogo?cd=';
  product = [];
  myproduct;
  user: User;
  constructor(private modal: ModalController, private productService: ProductService, private auth: AuthService) {
    this.getProduct();
    this.auth.getUser().then(data => {
      console.log(JSON.stringify(data));
      this.user = data;
    })
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
    await Browser.open({ url: this.baseCatalogo + this.user.codigo_Catalogo, toolbarColor: '#3B5998' })
  }
  async openModal(product) {
    console.log(product);
    const myModal = await this.modal.create({
      component: AddProductComponent,
      backdropDismiss: true,
      swipeToClose: true,
      componentProps: { product },
      showBackdrop: true,
      mode: 'ios',
    });
    await myModal.present();

    await myModal.onDidDismiss().then(data => console.log(data));
  }
  async getProduct() {
    this.myproduct = await this.productService.getMyCatalogo();
    console.log(this.myproduct);
    const listIdMyproduct = this.myproduct.map(product => product.ProductoData.id_Producto_Negocio);
    await this.productService.getProductAll().then(data => {
      const process = data.reduce((acc = [], pro) => {
        if (!listIdMyproduct.includes(pro.id_Producto_Negocio)) {
          acc.push(pro)
        }
        return acc;
      }, []);
      this.product = [...process];
    }).catch(err => console.log('product:', err));
  }
}

