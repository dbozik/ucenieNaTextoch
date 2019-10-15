import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Language, WordObject } from '../../../app/Objects';
import { getColor } from '../color.utils';
import { LanguageService } from '../services/language.service';
import { WordService } from '../services/word.service';

@Component({
    selector: 'app-words',
    templateUrl: './words.component.html',
    styleUrls: ['./words.component.scss'],
    providers: [WordService, LanguageService],
})
export class WordsComponent implements OnInit {

    public languages: Language[];
    public words: (WordObject | 'color')[] = [];

    public languagesControl: FormControl = new FormControl();

    constructor(
        private readonly languageService: LanguageService,
        private readonly wordService: WordService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.languagesControl.valueChanges.pipe(
            switchMap((languageId: string) => {
                return this.wordService.getWords(languageId);
            })
        ).subscribe((words: WordObject[]) => {
            this.words = words.sort((first, second) => first.level - second.level)
                .map(word => ({...word, color: getColor(word.level)}));
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

}
