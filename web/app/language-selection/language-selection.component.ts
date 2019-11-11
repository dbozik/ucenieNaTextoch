import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { Language } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { LoginService } from '../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { routingToken } from '../app.component';
import { Subject } from 'rxjs';
import { Routes } from '../../shared/routes.enum';

@Component({
    selector: 'app-language-selection',
    templateUrl: './language-selection.component.html',
    styleUrls: ['./language-selection.component.scss'],
    providers: [LanguageService, LoginService],
})
export class LanguageSelectionComponent implements OnInit {
    public languages: Language[];
    public route: string[];

    public languagesControl: FormControl = new FormControl();


    public get hidden(): boolean {
        const hiddenRoutes: string[] = [Routes.EDIT_TEXT, Routes.LOGIN, Routes.READ_TEXT, Routes.SETTINGS, Routes.WORD];

        return !this.route || this.route.length <= 0 || hiddenRoutes.includes(this.route[0]);
    }


    constructor(
        private readonly languageService: LanguageService,
        private readonly loginService: LoginService,
        private readonly changeDetection: ChangeDetectorRef,
        @Inject(routingToken) private readonly routing$: Subject<string[]>,
    ) {
        routing$.subscribe((route: string[]) => this.route = route);
    }

    ngOnInit() {
        this.languagesControl.valueChanges.pipe(
            distinctUntilChanged(),
        ).subscribe((languageId: string) => {
            this.languageService.selectLanguage(languageId);
        });

        this.loginService.loggedIn$.subscribe((loggedIn: boolean) => {
            if (loggedIn) {
                this.languageService.languagesChanged$
                    .pipe(
                        startWith(true),
                        switchMap(() => this.languageService.getLanguages())
                        ).subscribe((languages: Language[]) => {
                    if (languages && languages.length > 0) {
                        this.languages = languages.sort((first, second) => first.name.localeCompare(second.name));
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
