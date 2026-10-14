import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { GroupsService } from '../shared/services/groups/groups.service';
import { NewGroupDataService } from '../shared/services/new-group-data/new-group-data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-members',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button
            type="button"
            class="auth-back"
            (click)="goBack()"
            aria-label="Volver"
          >
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div class="auth-stepper" *ngIf="!isExistingGroup" aria-label="Paso 2 de 2">
            <div class="auth-stepper__bar auth-stepper__bar--done"></div>
            <div class="auth-stepper__bar auth-stepper__bar--current"></div>
            <span class="auth-stepper__count">2/2</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">
          {{ isExistingGroup ? 'Agregar miembros' : 'Nuevo grupo' }}
        </p>
        <h1 class="listing-header__title">¿A quién agregás?</h1>
      </header>

      <div class="am__container">
        <form [formGroup]="form" class="am__search-wrapper">
          <div class="am__search-block">
            <label class="auth-field__label" for="am-search">Buscar por DNI</label>
            <ion-searchbar
              class="listing-searchbar"
              id="am-search"
              formControlName="search"
              placeholder="Ingresá el DNI"
              debounce="400"
              type="number"
              inputmode="numeric"
              mode="md"
              (ionChange)="handleChange($event)"
            ></ion-searchbar>
            <p class="auth-field__error" *ngIf="form.get('search')?.value?.length > 0 && form.get('search')?.value?.length < 7">
              El DNI debe tener al menos 7 dígitos.
            </p>
            <p class="auth-field__error" *ngIf="searchMessage" role="status">{{ searchMessage }}</p>
          </div>

          <ion-item
            *ngIf="memberToAdd"
            class="member-row am__candidate"
            lines="none"
            [button]="true"
            detail="false"
            (click)="addMember()"
          >
            <div class="member-row__avatar">
              <app-avatar [photo]="memberToAdd.photo" [name]="memberToAdd.firstName + ' ' + memberToAdd.lastName"></app-avatar>
            </div>
            <div class="member-row__body">
              <span class="member-row__name">{{ memberToAdd.firstName | titlecase }} {{ memberToAdd.lastName | titlecase }}</span>
              <span class="member-row__sub">Tocá para agregar</span>
            </div>
            <button
              type="button"
              class="member-row__action member-row__action--primary"
              aria-label="Agregar miembro"
              (click)="addMember(); $event.stopPropagation()"
            >
              <ion-icon name="add"></ion-icon>
            </button>
          </ion-item>
        </form>

        <section *ngIf="isLoadingCurrentMembers" class="am__section">
          <div class="section-title am__section-title">
            <h2>Miembros actuales</h2>
          </div>
          <app-loading-state [rows]="3"></app-loading-state>
        </section>

        <section
          *ngIf="!isLoadingCurrentMembers && currentGroupMembers.length > 0"
          class="am__section"
        >
          <div class="section-title am__section-title">
            <h2>Miembros actuales</h2>
            <span>{{ currentGroupMembers.length }}</span>
          </div>

          <ion-item
            *ngFor="let member of currentGroupMembers"
            class="member-row"
            lines="none"
          >
            <div class="member-row__avatar">
              <app-avatar [photo]="member.photo" [name]="member.firstName + ' ' + member.lastName"></app-avatar>
            </div>
            <div class="member-row__body">
              <span class="member-row__name">{{ member.firstName | titlecase }} {{ member.lastName | titlecase }}</span>
            </div>
          </ion-item>
        </section>

        <section class="am__section">
          <div class="section-title am__section-title">
            <h2>A agregar</h2>
            <div class="am__section-actions">
              <span>{{ members.length }}</span>
              <button
                type="button"
                class="member-row__action member-row__action--danger"
                *ngIf="members.length > 0"
                (click)="clearMembers()"
                aria-label="Quitar todos"
              >
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          </div>

          <ng-container *ngIf="members.length > 0; else emptyMembers">
            <ion-item
              *ngFor="let member of members"
              class="member-row"
              lines="none"
            >
              <div class="member-row__avatar">
                <app-avatar [photo]="member.photo" [name]="member.firstName + ' ' + member.lastName"></app-avatar>
              </div>
              <div class="member-row__body">
                <span class="member-row__name">{{ member.firstName | titlecase }} {{ member.lastName | titlecase }}</span>
              </div>
              <button
                type="button"
                class="member-row__action member-row__action--neutral"
                (click)="removeMember(member.dni)"
                aria-label="Quitar"
              >
                <ion-icon name="close"></ion-icon>
              </button>
            </ion-item>
          </ng-container>

          <ng-template #emptyMembers>
            <p class="am__empty">
              {{ isExistingGroup ? 'Agregá miembros buscándolos por DNI.' : 'Podés saltarte este paso si querés crear el grupo solo.' }}
            </p>
          </ng-template>
        </section>
      </div>
    </ion-content>

    <ion-footer class="auth-footer" mode="md">
      <button
        type="button"
        class="auth-btn auth-btn--primary"
        (click)="onSubmit()"
      >
        {{ isExistingGroup ? 'Agregar' : 'Crear grupo' }}
      </button>
    </ion-footer>
  `,
  styleUrls: ['./add-members.page.scss'],
})
export class AddMembersPage implements OnInit {
  groupId: string;
  currentGroupMembers: any[] = [];
  /** Solo sobre un grupo existente: los miembros actuales llegan por API. */
  isLoadingCurrentMembers = false;
  memberToAdd: { firstName: string; lastName: string; dni: number };
  /** Por qué la búsqueda por DNI no trajo a nadie. */
  searchMessage = '';
  members: { firstName: string; lastName: string; dni: number }[] = [];
  form = this.fb.group({
    search: null,
  });
  constructor(
    private groupsService: GroupsService,
    private newGroupDataService: NewGroupDataService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private navController: NavController,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}

  get isExistingGroup(): boolean {
    return !!this.groupId;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.loadCurrentGroupMembers();
      }
    });
  }

  goBack() {
    if (this.isExistingGroup) {
      this.navController.navigateBack([`/groups/${this.groupId}/members`]);
    } else {
      this.navController.navigateBack(['/groups/create']);
    }
  }

  async loadCurrentGroupMembers() {
    this.isLoadingCurrentMembers = this.currentGroupMembers.length === 0;
    try {
      const group = await this.groupsService.getFamilyGroupById(this.groupId);
      this.currentGroupMembers = group.members || [];
    } catch (error) {
      console.error('AddMembersPage: error cargando los miembros actuales', error);
    } finally {
      this.isLoadingCurrentMembers = false;
    }
  }

  /**
   * Antes, si el DNI no existía (o era el propio, o alguien ya agregado) la
   * búsqueda simplemente no mostraba nada y no se entendía qué pasaba.
   */
  async handleChange(event) {
    const dni = String(event.detail.value ?? '').trim();
    this.memberToAdd = null;
    this.searchMessage = '';
    if (dni.length < 7) {
      return;
    }

    if (this.isNotMe(dni)) {
      this.searchMessage = 'Ese DNI es el tuyo.';
      return;
    }
    if (this.memberAlreadyAdded(dni)) {
      this.searchMessage = 'Esa persona ya está en el grupo o en la lista.';
      return;
    }
    try {
      const found = await this.auth.getUserByDni(dni);
      // Si mientras tanto se cambió el DNI, esta respuesta ya no aplica.
      if (String(this.form.get('search')?.value ?? '').trim() !== dni) {
        return;
      }
      if (found) {
        this.memberToAdd = found;
      } else {
        this.searchMessage = 'No encontramos a nadie registrado con ese DNI.';
      }
    } catch (error) {
      console.error('AddMembersPage: error buscando por DNI', error);
      this.searchMessage = 'No pudimos buscar ese DNI. Probá de nuevo.';
    }
  }

  // El buscador entrega strings y los DNI pueden venir como número: con `===`
  // estas comparaciones nunca coincidían.
  memberAlreadyAdded(dni: string | number) {
    const same = (m) => String(m?.dni) === String(dni);
    return this.members.some(same) || this.currentGroupMembers.some(same);
  }

  clearMembers() {
    this.members = [];
  }

  addMember() {
    if (!this.memberToAdd) return;
    this.members.push(this.memberToAdd);
    this.memberToAdd = null;
    this.form.reset();
  }
  removeMember(dni: number) {
    this.members = this.members.filter((m) => String(m.dni) !== String(dni));
    this.form.reset();
  }

  isNotMe(dni: string) {
    return String(dni) === String(this.auth.user()?.dni);
  }

  getInitials(member: any): string {
    const first = (member?.firstName ?? '').trim();
    const last = (member?.lastName ?? '').trim();
    return ((first[0] || '') + (last[0] || '')).toUpperCase() || '?';
  }

  async onSubmit() {
    if (this.groupId) {
      // Lógica para agregar miembros a un grupo existente
      try {
        for (const member of this.members) {
          // Evita duplicados antes de agregar
          if (!this.currentGroupMembers.some((m) => m.dni === member.dni)) {
            await this.groupsService.addMember(this.groupId, member);
          }
        }
        this.toastService.showSuccess('Miembros agregados exitosamente');
        this.navController.back(); // Vuelve a la vista anterior (group-members)
      } catch (err) {
        console.log(err);
        this.toastService.showError('Error al agregar miembros');
      }
    } else {
      // Lógica para crear grupo nuevo (flujo original)
      const data = { ...this.newGroupDataService.data, members: this.members };
      try {
        await this.groupsService.createGroup(data);
        this.success();
      } catch (err) {
        // Antes esto era un console.log: si el alta fallaba, la pantalla se
        // quedaba quieta sin ningún aviso y no había forma de saber por qué.
        console.error('AddMembersPage: error creando el grupo', err);
        this.toastService.showError(
          err?.error?.message || 'No pudimos crear el grupo. Revisá los datos e intentá de nuevo.',
        );
      }
    }
  }

  success() {
    this.toastService.showSuccess('Grupo creado exitosamente');
    this.navController.navigateRoot(['/tabs/groups']);
  }
}
