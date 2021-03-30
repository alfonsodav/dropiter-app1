import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule, LOCALE_ID} from '@angular/core';
import es from '@angular/common/locales/es';
import {CommonModule, registerLocaleData} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
import {ShareModule} from '../share/share.module';
import {Tab3PageRoutingModule} from './tab3-routing.module';
registerLocaleData(es);

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ShareModule,
    RouterModule.forChild([{path: '', component: Tab3Page}]),
    Tab3PageRoutingModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-VE' }],
  declarations: [Tab3Page]
})
export class Tab3PageModule {
}
