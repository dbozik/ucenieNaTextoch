import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Routes as AppRoutes } from '../shared/routes.enum';
import { AddTextComponent } from './add-text/add-text.component';
import { LoginComponent } from './login/login.component';
import { ReadTextComponent } from './read-text/read-text.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { TextEditComponent } from './text-edit/text-edit.component';
import { TextsComponent } from './texts/texts.component';
import { WordEditComponent } from './word-edit/word-edit.component';
import { WordsComponent } from './words/words.component';

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
        path: AppRoutes.ADD_TEXT,
        component: AddTextComponent,
    },
    {
        path: `${AppRoutes.READ_TEXT}/:id`,
        component: ReadTextComponent,
    },
    {
        path: `${AppRoutes.EDIT_TEXT}/:id`,
        component: TextEditComponent,
    },
    {
        path: AppRoutes.TEXTS,
        component: TextsComponent,
    },
    {
        path: AppRoutes.WORDS,
        component: WordsComponent,
    },
    {
        path: `${AppRoutes.WORD}/:id`,
        component: WordEditComponent,
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
