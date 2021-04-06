import {Component, OnInit, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LocateService} from 'src/app/services/locate.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit {
  @Input() Id;
  bank = {
    id_Dropinauta_FK: '',
    id_Banco_FK: '',
    id_Tipo_Cuenta_FK: '',
    numero_Cuenta: '',
    identidad: ''
  };
  listBank;
  typeBank;
  myBank;
  dataBank = {
    id_Bank_Data: 0,
    id_Dropinauta_FK: 0,
    id_Banco_FK: 0,
    id_Tipo_Cuenta_FK: 0,
    numero_Cuenta: '',
    BancoData: {},
    DropinautaData: {},
    TipoCuentaData: {},
    identidad: ''
  };

  constructor(private modalIo: ModalController, private locale: LocateService) {
  }

  ngOnInit() {
    this.getDataBank();
    if (this.Id) {
      this.getUserBank();
    }
  }

  getDataBank() {
    this.locale.getlistBank().subscribe(data => this.listBank = data);
    this.locale.getTipeBank().subscribe(data => this.typeBank = data);
  }

  dismiss() {
    console.log(this.bank);
    this.modalIo.dismiss(this.bank);
  }

  getUserBank() {
    this.locale.getMyBank(this.Id).subscribe(data => {
      console.log(data);
      this.dataBank = data;
      this.locale.getMyBank(this.dataBank.id_Banco_FK).subscribe(bank => this.myBank = bank);
    });
  }
  updateData(){
    this.locale.updateDataBank(this.dataBank).subscribe(data => {
      console.log(data);
      this.modalIo.dismiss();
    });
  }
}
