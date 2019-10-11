import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language, Text, TextPart } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-read-text',
    templateUrl: './read-text.component.html',
    styleUrls: ['./read-text.component.scss'],
    providers: [TextService, LanguageService],
})
export class ReadTextComponent implements OnInit {
    public text: Text;
    public translateLink: string = '';

    private language: Language;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        const textId = this.route.snapshot.params.id;

        this.textService.getParsed(textId).subscribe((result: Text) => {
            this.text = result;
            this.changeDetectorRef.detectChanges();

            this.languageService.getLanguage(this.text.languageId).subscribe((language: Language) => {
                this.language = language;
                this.setTranslateLink('', this.language.dictionary);
                this.changeDetectorRef.detectChanges();
            });
        });
    }


    public setTranslateLink(word: string, dictionary: string = this.language.dictionary): void {
        this.translateLink = dictionary.replace('{word}', word);
    }


    public wordEdit(word: TextPart): void {
        this.textService.editWord(word).subscribe(() => {
            for (let index = 0; index < this.text.textParts.length; index++) {
                if (this.text.textParts[index].wordId === word.wordId) {
                    this.text.textParts[index] = {
                        wordId: word.wordId,
                        content: this.text.textParts[index].content,
                        level: word.level,
                        type: word.type,
                        translation: word.translation,
                        exampleSentence: word.exampleSentence,
                        exampleSentenceTranslation: word.exampleSentenceTranslation,
                    };
                }
            }

            this.changeDetectorRef.detectChanges();
        });
    }
}
