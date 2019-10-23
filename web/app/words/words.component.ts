import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Word } from '../../../app/Objects';
import { getColor } from '../color.utils';
import { LanguageService } from '../services/language.service';
import { WordService } from '../services/word.service';

@Component({
    selector: 'app-words',
    templateUrl: './words.component.html',
    styleUrls: ['./words.component.scss'],
    providers: [WordService, LanguageService],
})
export class WordsComponent implements OnInit, OnDestroy {

    public words: (Word | 'color')[] = [];

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly languageService: LanguageService,
        private readonly wordService: WordService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }


    ngOnInit() {
        this.languageService.languageSelected$.pipe(
            startWith(true),
            takeUntil(this.componentDestroyed$),
            switchMap(() => {
                return this.wordService.getWords();
            })
        ).subscribe((words: Word[]) => {
            this.words = words.sort((first, second) => first.level - second.level)
                .map(word => ({...word, color: getColor(word.level)}));
            this.changeDetection.detectChanges();
        });
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }


    public exportWords() {
        const DELIMITER = ';';
        const words: (Word | 'color')[] = this.words;

        // specify how you want to handle null values here
        const replacer = (key, value) => value === null || typeof value === 'undefined' ? '' : value;

        const header = ['word', 'translate', 'sentence', 'sentenceTranslate'];

        const jsonProcess = (item: string) => JSON.stringify(item, replacer);

        const csv = words.map((word: Word) => [
            jsonProcess(word.content),
            jsonProcess(word.translation),
            jsonProcess(word.exampleSentence),
            jsonProcess(word.exampleSentenceTranslation),
        ].join(DELIMITER));
        csv.unshift(header.join(DELIMITER));
        const csvArray = csv.join('\r\n');

        const downloadLink = document.createElement('a');
        const blob = new Blob(['\ufeff', csvArray], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);

        downloadLink.href = url;
        downloadLink.download = 'export.csv';
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        downloadLink.remove();
    }


    public editWord(wordId): void {
        this.wordService.openWord(wordId).subscribe();
    }
}
