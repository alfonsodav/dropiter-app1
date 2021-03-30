import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit {
  bank = {
    ahorro: false,
    number: '',
    name: '',
    numberId: ''
  };

  constructor(private modalIo: ModalController) { }
  ngOnInit() {
  }
  dismiss() {
    this.modalIo.dismiss(this.bank);
  }

}
