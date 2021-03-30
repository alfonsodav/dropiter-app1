import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {LoadingComponent} from './loading/loading.component';
import {IonicModule} from '@ionic/angular';
import {BankComponent} from './modals/bank/bank.component';
import {FormsModule} from '@angular/forms';
import { UpdateProductComponent } from './modals/update-product/update-product.component';
import { AddProductComponent } from './modals/add-product/add-product.component';

@NgModule({
  declarations: [HeaderComponent, LoadingComponent, BankComponent, UpdateProductComponent, AddProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [HeaderComponent, LoadingComponent, BankComponent, UpdateProductComponent, AddProductComponent]
})
export class ShareModule {
}
