import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddTextComponent } from './add-text/add-text.component';
import { SignupComponent } from './signup/signup.component';
import { Routes as AppRoutes } from '../shared/routes.enum';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent,
  },
  {
    path: AppRoutes.SIGNUP,
    component: SignupComponent,
  },
  {
    path: AppRoutes.TEXTS,
    component: AddTextComponent,
  },
  {
    path: AppRoutes.SETTINGS,
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
