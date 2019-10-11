import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Language, Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.scss'],
    providers: [TextService, LanguageService],
})
export class TextsComponent implements OnInit {
    public languages: Language[];
    public texts: Text[] = [];

    public languagesControl: FormControl = new FormControl();

    constructor(
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.languagesControl.valueChanges.pipe(
            switchMap((languageId: string) => {
                return this.textService.getTexts(languageId);
            })
        ).subscribe((texts: Text[]) => {
            this.texts = texts;
            this.changeDetection.detectChanges();
        });

        this.languageService.getLanguages().subscribe((languages: Language[]) => {
            this.languages = languages;
            if (this.languages && this.languages.length > 0) {
                this.languagesControl.setValue(this.languages[0]._id);
            }
            this.changeDetection.detectChanges();
        });
    }


    public textClick(textId: string): void {
        this.textService.openText(textId);
    }

}
