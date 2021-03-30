import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorConectPageRoutingModule } from './error-conect-routing.module';

import { ErrorConectPage } from './error-conect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorConectPageRoutingModule
  ],
  declarations: [ErrorConectPage]
})
export class ErrorConectPageModule {}
