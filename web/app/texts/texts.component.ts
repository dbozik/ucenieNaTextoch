import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { LoginService } from '../services/login.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.scss'],
    providers: [TextService, LanguageService],
})
export class TextsComponent implements OnInit {
    public texts: Text[] = [];

    constructor(
        private readonly languageService: LanguageService,
        private readonly loginService: LoginService,
        private readonly textService: TextService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.loginService.logIn();

        this.languageService.languageChanged.pipe(
            switchMap((selected: boolean) => {
                if (selected) {
                    return this.textService.getTexts();
                } else {
                    return of([]);
                }
            })
        ).subscribe((texts: Text[]) => {
            this.texts = texts;
            this.changeDetection.detectChanges();
        });
    }


    public textClick(textId: string): void {
        this.textService.openText(textId);
    }

}
