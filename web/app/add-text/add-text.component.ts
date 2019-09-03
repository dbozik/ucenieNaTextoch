import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Language } from '../../../app/Objects/Language';
import { LanguageService } from '../services/language.service';

@Component({
    selector: 'app-add-text',
    templateUrl: './add-text.component.html',
    styleUrls: ['./add-text.component.scss'],
    providers: [LanguageService],
})
export class AddTextComponent implements OnInit {

    public languages: Language[];

    constructor(
        private readonly languageService: LanguageService,
        private readonly changeDetector: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.languageService.getLanguages().subscribe((languages: Language[]) => {
            this.languages = languages;
            this.changeDetector.detectChanges();
        });
    }

}
