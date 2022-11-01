import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IsLoggedInGuard } from './guards/is-logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: () =>
      import('./views/register/register.module').then((m) => m.RegisterModule),
      canActivate: [IsLoggedInGuard],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./views/welcome/welcome.module').then((m) => m.WelcomePageModule),
    canActivate: [IsLoggedInGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./views/login/login.module').then((m) => m.LoginPageModule),
      canActivate: [IsLoggedInGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./views/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./views/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'new-group',
    loadChildren: () => import('./views/groups/new-group/new-group.module').then( m => m.NewGroupPageModule)
  },
  {
    path: 'groups-home/:id',
    loadChildren: () => import('./views/groups/group-home/group-home.module').then( m => m.GroupHomePageModule)
  },
  {
    path: 'appointments',
    loadChildren: () => import('./views/appointments/appointments.module').then( m => m.AppointmentsPageModule)
  },
  {
    path: 'doctors',
    loadChildren: () => import('./views/doctors/doctors.module').then( m => m.DoctorsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
