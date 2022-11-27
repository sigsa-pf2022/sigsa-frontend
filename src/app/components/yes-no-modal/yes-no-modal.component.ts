import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-yes-no-modal',
  template: ` <div class="modal-content">
    <div class="body">
      <ion-label class="ui-font-profile-label">{{ this.text }}</ion-label>
      <div class="body__actions">
        <ion-button color="medium" (click)="cancel()">No</ion-button>
        <ion-button color="danger" (click)="confirm()">Si</ion-button>
      </div>
    </div>
  </div>`,
  styleUrls: ['./yes-no-modal.component.scss'],
})
export class YesNoModalComponent implements OnInit {
  @Input() text: string;
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  cancel(){
    this.modalController.dismiss(false);
  }

  confirm(){
    this.modalController.dismiss(true);
  }
}
