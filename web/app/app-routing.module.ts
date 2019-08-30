import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Routes as AppRoutes } from '../shared/routes.enum';
import { AddTextComponent } from './add-text/add-text.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';

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
export class AppRoutingModule {
}
