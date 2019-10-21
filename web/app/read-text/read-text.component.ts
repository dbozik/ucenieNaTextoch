import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Language, Text, TextPart } from '../../../app/Objects';
import { getColor } from '../color.utils';
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
            this.text.textParts = this.processTextParts(result.textParts);
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
        this.changeDetectorRef.detectChanges();
    }


    public wordEdit(word: TextPart): void {
        this.textService.editWord(word).subscribe(() => {
            const editedTextParts: TextPart[] = [];

            for (const textPart of this.text.textParts) {
                if (textPart.wordId === word.wordId) {
                    editedTextParts.push({
                        wordId: word.wordId,
                        content: textPart.content,
                        level: word.level,
                        color: getColor(word.level),
                        title: word.translation,
                        type: word.type,
                        translation: word.translation,
                        exampleSentence: word.exampleSentence,
                        exampleSentenceTranslation: word.exampleSentenceTranslation,
                    });
                } else {
                    editedTextParts.push(JSON.parse(JSON.stringify(textPart)));
                }
            }

            this.text.textParts = editedTextParts;
            this.changeDetectorRef.detectChanges();
        });
    }


    private processTextParts(textParts: TextPart[]): TextPart[] {
        return textParts.map((textPart: TextPart) => ({
            ...textPart,
            color: textPart.type === 'word' ? getColor(textPart.level) : '',
            title: textPart.type === 'word' ? textPart.translation || '' : ''
        }));
    }
}
