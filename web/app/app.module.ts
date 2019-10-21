import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTextComponent } from './add-text/add-text.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScrollItemDirective } from "./infinite-scroll/scroll-item.directive";
import { LanguageSelectionComponent } from './language-selection/language-selection.component';
import { LoginComponent } from './login/login.component';
import { ReadTextComponent } from './read-text/read-text.component';
import { SettingsComponent } from './settings/settings.component';
import { SignupComponent } from './signup/signup.component';
import { TextsComponent } from './texts/texts.component';
import { WebviewDirective } from './webview.directive';
import { WordComponent } from './word/word.component';
import { WordsComponent } from './words/words.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';

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
        WordComponent,
        WordsComponent,
        LanguageSelectionComponent,
        InfiniteScrollComponent,
        ScrollItemDirective,
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
