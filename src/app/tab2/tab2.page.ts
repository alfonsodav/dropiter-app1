import { Component, ViewChild } from '@angular/core';
import {AlertController, IonInfiniteScroll, ModalController} from '@ionic/angular';
import { Category, Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { AddProductComponent } from '../share/modals/add-product/add-product.component';
import { UpdateProductComponent } from '../share/modals/update-product/update-product.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  products;
  dataProducts;
  myproduct = [];
  categorias;
  catalogo = true;
  catSelect = [];

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(private modalIo: ModalController, private productService: ProductService, private alertIo: AlertController) {
    this.getProduct();
    // this.getProductHttp();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      if (this.products.length === 100) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  selectCategory(event, cat: Category) {
    if (this.catSelect.includes(cat.id_Categoria)){
      const index = this.catSelect.indexOf(cat.id_Categoria);
      this.catSelect.splice(index, 1);
    } else {
      this.catSelect.push(cat.id_Categoria);
    }
    console.log(this.catSelect);
    event.target.parentElement.classList.toggle('active');
    this.products = this.dataProducts.filter((pro: Product) => {
      return this.catSelect.length ? this.catSelect.includes(pro.id_Categoria_Producto_FK) : true;
    });
  }
  async getProduct() {
    this.myproduct = await this.productService.getMyCatalogo() || [];
    console.log(this.myproduct);
    const listIdMyproduct = this.myproduct.map(product => product.ProductoData.id_Producto_Negocio);
    await this.productService.getProductAll().then(data => {
      const process = data.reduce((acc = [], pro) => {
        if (!listIdMyproduct.includes(pro.id_Producto_Negocio)) {
          acc.push(pro);
        }
        return acc;
      }, []);
      this.products = [...process];
      this.dataProducts = [...process];
      this.getCategory(this.products);
    }).catch(err => console.log('product:', err));
  }
  getProductHttp(): any {
    this.productService.getCatalogo().subscribe(data => {
      this.myproduct = [...data];
      console.log(this.myproduct);
    });
    this.productService.getProductHttp().subscribe(data => {
      this.products = [...data];
      this.dataProducts = [...data];
      this.getCategory(this.products);
    });
  }

  getCategory(data) {
    this.categorias = data.reduce((acc = [], product) => {
      if (!acc.find(cat => cat.id_Categoria === product.CategoriaData.id_Categoria)){
        acc.push(product.CategoriaData);
      }
      return acc;
    }, []);
    console.log(this.categorias);
  }
  removeCatalogo(product){
    this.productService.removeCatalogo(product.id_Producto_Catalogo_Dropinauta).subscribe(() => {
      this.getProduct();
    },  async err => {
      const myalert = await this.alertIo.create(
        {message: 'No pudimos eliminar el producto, comprueba tu conexión',
          backdropDismiss: true,
          buttons: ['Aceptar']
        });
      await myalert.present();
    });
  }
  segmentChanged(event, general?): void{
    switch (event.detail.value){
      case 'catalogo':
        this.catalogo = true;
        break;
      case 'general':
        this.catalogo = false;
        break;
      default:
        this.catalogo = true;
    }
    if (general) {
      this.catalogo = false;
    }
  }
  async modalProduct(product) {
    console.log(product);
    const myModal = await this.modalIo.create({
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
  async modalUpdateProduct(product) {
    console.log(product);
    const myModal = await this.modalIo.create({
      component: UpdateProductComponent,
      backdropDismiss: true,
      swipeToClose: true,
      componentProps: { product },
      showBackdrop: true,
      mode: 'ios',
    });
    await myModal.present();

    await myModal.onDidDismiss().then(data => console.log(data));
  }
  filterCatalogo(value: string){
    value = value ? value.trim().toLowerCase() : '';
    this.myproduct = this.myproduct.filter(pro => {
      return pro.ProductoData.nombre.toLowerCase().includes(value) || pro.ProductoData.marca.toLowerCase().includes(value);
    });
  }
}
