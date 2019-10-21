import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { startWith, switchMap } from 'rxjs/operators';
import { Language } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-language-selection',
    templateUrl: './language-selection.component.html',
    styleUrls: ['./language-selection.component.scss'],
    providers: [LanguageService, LoginService],
})
export class LanguageSelectionComponent implements OnInit {
    public languages: Language[];

    public languagesControl: FormControl = new FormControl();


    constructor(
        private readonly languageService: LanguageService,
        private readonly loginService: LoginService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.languagesControl.valueChanges.subscribe((languageId: string) => {
            this.languageService.selectLanguage(languageId);
        });

        this.loginService.loggedIn$.subscribe((loggedIn: boolean) => {
            if (loggedIn) {
                this.languageService.languageSelected$
                    .pipe(
                        startWith(true),
                        switchMap(() => this.languageService.getLanguages())
                        ).subscribe((languages: Language[]) => {
                    this.languages = languages;
                    if (this.languages && this.languages.length > 0) {
                        this.languagesControl.setValue(this.languages[0]._id);
                    }
                    this.changeDetection.detectChanges();
                });
            } else {
                this.languages = null;
                this.changeDetection.detectChanges();
            }
        });
    }

}
