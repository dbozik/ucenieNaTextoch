import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTextComponent } from './add-text/add-text.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { TextsComponent } from './texts/texts.component';
import { ReadTextComponent } from './read-text/read-text.component';
import { WebviewDirective } from './webview.directive';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AddTextComponent,
        SignupComponent,
        SettingsComponent,
        TextsComponent,
        ReadTextComponent,
        WebviewDirective,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
