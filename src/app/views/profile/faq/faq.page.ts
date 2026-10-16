import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FAQ_SECTIONS } from './faq-content';

@Component({
  selector: 'app-faq',
  template: `
    <ion-header class="auth-page-header" mode="md">
      <ion-toolbar class="auth-page-toolbar" mode="md">
        <div class="auth-topbar">
          <button type="button" class="auth-back" (click)="goBack()" aria-label="Volver">
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div></div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="listing">
      <header class="listing-header">
        <p class="listing-header__eyebrow">Ayuda</p>
        <h1 class="listing-header__title">Preguntas frecuentes</h1>
      </header>

      <div class="faq">
        <section class="faq__section" *ngFor="let section of sections; let s = index">
          <p class="section-eyebrow faq__eyebrow">
            <ion-icon [name]="section.icon" aria-hidden="true"></ion-icon>
            {{ section.title }}
          </p>

          <div class="faq__card">
            <div class="faq__item" *ngFor="let item of section.items; let i = index">
              <button
                type="button"
                class="faq__question"
                [attr.aria-expanded]="isOpen(s, i)"
                [attr.aria-controls]="'faq-' + s + '-' + i"
                (click)="toggle(s, i)"
              >
                <span>{{ item.question }}</span>
                <ion-icon
                  name="chevron-down"
                  class="faq__chevron"
                  [class.faq__chevron--open]="isOpen(s, i)"
                  aria-hidden="true"
                ></ion-icon>
              </button>
              <p class="faq__answer" [id]="'faq-' + s + '-' + i" *ngIf="isOpen(s, i)">{{ item.answer }}</p>
            </div>
          </div>
        </section>
      </div>
    </ion-content>
  `,
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage {
  sections = FAQ_SECTIONS;
  /** Se pueden abrir varias a la vez: comparar respuestas es un uso normal. */
  private open = new Set<string>();

  constructor(private navController: NavController) {}

  isOpen(section: number, item: number): boolean {
    return this.open.has(`${section}-${item}`);
  }

  toggle(section: number, item: number) {
    const key = `${section}-${item}`;
    if (this.open.has(key)) this.open.delete(key);
    else this.open.add(key);
  }

  goBack() {
    this.navController.navigateBack(['/profile']);
  }
}
