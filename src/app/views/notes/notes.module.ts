import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/services/interceptors/token-interceptor.service';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { NotesPage } from './notes.page';

const routes: Routes = [
  {
    path: '',
    component: NotesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, IonicModule, SharedComponentsModule],
  declarations: [NotesPage],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
})
export class NotesPageModule {}
