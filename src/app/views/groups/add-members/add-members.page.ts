import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { GroupsService } from '../shared/services/groups/groups.service';
import { NewGroupDataService } from '../shared/services/new-group-data/new-group-data.service';

@Component({
  selector: 'app-add-members',
  template: `
    <ion-header class="ui-background__light">
      <ion-toolbar class="ui-toolbar__primary ui-toolbar__counter">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/groups/create"></ion-back-button>
        </ion-buttons>
        <ion-title class="ui-header__title-center">Agregar miembros</ion-title>
        <ion-label class="ui-header__counter" slot="end">2 de 2</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content class="am">
      <div>
        <form [formGroup]="this.form">
          <ion-searchbar
            formControlName="search"
            placeholder="Ingrese ID de Usuario"
            class="ui-search-input"
            debounce="400"
            type="number"
            (ionChange)="handleChange($event)"
          ></ion-searchbar>
          <ion-item lines="none" class="am__member" *ngIf="this.memberToAdd">
            <ion-label>{{ this.memberToAdd.firstName + ' ' + this.memberToAdd.lastName }}</ion-label>
            <ion-icon name="add" (click)="addMember()"></ion-icon>
          </ion-item>
        </form>
        <div class="am__no-member" *ngIf="!this.memberToAdd"></div>
      </div>
      <div>
        <ion-list class="am__members-list">
          <ion-list-header class="am__members-list__header">
            <div class="am__members-list__header__container">
              <ion-label>Miembros</ion-label>
              <ion-label> ({{ this.members.length }})</ion-label>
              <ion-icon color="danger" (click)="clearMembers()" name="trash"></ion-icon>
            </div>
          </ion-list-header>
          <ion-item lines="none" class="am__members-list__item" *ngFor="let member of this.members">
            <ion-label>
              {{ member.firstName + ' ' + member.lastName }}
            </ion-label>
            <ion-icon color="complementary" (click)="removeMember(member.username)" name="close"></ion-icon>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
    <ion-footer class="footer__light">
      <ion-button (click)="onSubmit()" expand="block" [disabled]="!isFormValid()" color="primary">
        Confirmar
      </ion-button>
    </ion-footer>
  `,
  styleUrls: ['./add-members.page.scss'],
})
export class AddMembersPage implements OnInit {
  memberToAdd: { firstName: string; lastName: string; username: number };
  members: { firstName: string; lastName: string; username: number }[] = [];
  form = this.fb.group({
    search: null,
  });
  constructor(
    private groupsService: GroupsService,
    private newGroupDataService: NewGroupDataService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private navController: NavController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async handleChange(event) {
    const username = event.detail.value;
    if (username.length === 6 && !this.memberAlreadyAdded(username) && !this.isNotMe(username)) {
      this.memberToAdd = await this.auth.getUserByUsername(username);
    } else {
      this.memberToAdd = null;
    }
  }

  memberAlreadyAdded(username: number) {
    return this.members.some((m) => m.username === Number(username));
  }

  clearMembers() {
    this.members = [];
  }

  addMember() {
    this.members.push(this.memberToAdd);
    this.memberToAdd = null;
  }
  removeMember(username: number) {
    this.members = this.members.filter((m) => m.username !== username);
    this.form.reset();
  }

  isNotMe(username: number) {
    return Number(username) === this.auth.user().username;
  }

  isFormValid() {
    return this.members.length > 0;
  }

  async onSubmit() {
    const data = { ...this.newGroupDataService.data, members: this.members };
    await this.groupsService
      .createGroup(data)
      .then(() => this.success())
      .catch((err) => console.log(err));
  }

  success() {
    this.toastService.showSuccess('Grupo creado exitosamente');
    this.navController.navigateRoot(['/tabs/groups']);
  }
}
