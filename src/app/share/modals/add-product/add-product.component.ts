import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  @Input() product: Product;
  user: User;
  precio: number;
  constructor(private modalIo: ModalController, private toastIo: ToastController,
              private productService: ProductService, private auth: AuthService) { }

  ngOnInit() {
    console.log('modal product', JSON.stringify(this.product));
    this.precio = Number(this.product.precio || this.product.precio_Descuento) * 1.2;
    this.auth.getUser().then(data => this.user = data).finally(() => console.log(this.user));
  }
  addProduct() {
    const body = {
      id_Dropinauta_FK: this.user.id_Dropinauta,
      id_Producto_FK: this.product.id_Producto_Negocio,
      precio: Number(this.precio)
    };
    /*const toCategory = {
      id_Dropinauta_FK: this.user.id_Dropinauta,
      id_Admin_Categoria_Producto_FK: this.product.id_Categoria_Producto_FK
    };*/
    this.productService.addToCatalogo(body).then(data => {
      console.log(data.data);
      alert('Producto agregado al catalogo');
    }).catch(err => {
      console.log(JSON.stringify(err));
      alert('Ocurrio un error al intentar agregar el producto');
    }).finally(() => this.dismiss());
  }


  dismiss() {
    this.modalIo.dismiss();
  }
  toastCreate(message): void {
    this.toastIo.create({
      header: 'Info',
      message,
      position: 'bottom',
      duration: 2000
    }).then(toast => toast.present);
  }

}
