import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FAKE_APPOINTMENTS_DATA } from 'src/app/data/appointmentsData';
import { AppointmentsService } from './shared/services/appointments/appointments.service';

@Component({
  selector: 'app-appointments',
  template: `<ion-content class="apts">
    <ion-label class="apts__title"> Mis Turnos </ion-label>
    <form [formGroup]="this.searchForm" class="apts__search">
      <ion-searchbar
        formControlName="search"
        placeholder="Buscar turno ..."
        class="ui-search-input  ui-search-input__no-show"
        debounce="400"
        type="string"
        (ionChange)="handleChange($event)"
      ></ion-searchbar>
    </form>
    <!-- <ion-list class="apts__list" *ngIf="this.appointments.length > 0"> -->
    <cdk-virtual-scroll-viewport itemSize="1">
        <app-appointments-item-list
          *cdkVirtualFor="let appointment of this.appointments"
          [appointment]="appointment"
        ></app-appointments-item-list>
      </cdk-virtual-scroll-viewport>
    <!-- </ion-list> -->
    <div>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="newAppointment()" class="apts__fab">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </div>
  </ion-content>`,
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  searchForm = this.fb.group({
    search: '',
  });
  constructor(
    private fb: FormBuilder,
    private navController: NavController,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.appointments = await this.appointmentsService.getAppointmentsByUser();
    this.filteredAppointments = this.appointments;
  }

  async handleChange(event) {
    const search = event.detail.value;
    this.filteredAppointments = this.appointments.filter(
      (d) => d.professional.firstName.includes(search) || d.professional.lastName.includes(search)
    );
  }

  newAppointment() {
    return this.navController.navigateForward(['/appointments/pick-doctor']);
  }
}
