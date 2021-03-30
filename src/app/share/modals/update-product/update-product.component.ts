import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  @Input() product: Product;

  constructor(private modalIo: ModalController, private toastIo: ToastController,
    private productService: ProductService, private auth: AuthService) { }

  ngOnInit() {}

  updateProduct() {
    this.productService.updateCatalogo(this.product).then(() => {
      this.toastCreate('Precio Actualizado')
    }).then(() => this.dismiss()).catch(err => {
      console.log(JSON.stringify(err), err);
      this.toastCreate('Ocurrio un error, verifica tu conexión ')
    })
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
