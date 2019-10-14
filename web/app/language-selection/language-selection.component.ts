import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-language-selection',
    templateUrl: './language-selection.component.html',
    styleUrls: ['./language-selection.component.scss'],
    providers: [TextService, LanguageService],
})
export class LanguageSelectionComponent implements OnInit {
    public languages: Language[];

    public languagesControl: FormControl = new FormControl();


    constructor(
        private readonly languageService: LanguageService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        console.log('language selection component created');
        this.languagesControl.valueChanges.subscribe((languageId: string) => {
            this.languageService.languageSelected(languageId);
        });

        this.languageService.getLanguages().subscribe((languages: Language[]) => {
            this.languages = languages;
            if (this.languages && this.languages.length > 0) {
                this.languagesControl.setValue(this.languages[0]._id);
            }
            this.changeDetection.detectChanges();
        });
    }

}
