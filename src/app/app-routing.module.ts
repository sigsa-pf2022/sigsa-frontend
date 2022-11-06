import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlreadyLoggedGuard } from './guards/alreadyLogged/already-logged.guard';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: () => import('./views/register/register.module').then((m) => m.RegisterModule),
    canActivate: [AlreadyLoggedGuard],
  },
  {
    path: 'welcome',
    loadChildren: () => import('./views/welcome/welcome.module').then((m) => m.WelcomePageModule),
    canActivate: [AlreadyLoggedGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [AlreadyLoggedGuard],
  },
  {
    path: 'tabs',
    loadChildren: () => import('./views/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./views/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'groups',
    loadChildren: () => import('./views/groups/groups.module').then((m) => m.GroupsModule),
    canActivate: [AuthGuard],
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
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
