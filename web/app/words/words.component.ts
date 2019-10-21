import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { WordObject } from '../../../app/Objects';
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

    public words: (WordObject | 'color')[] = [];

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
        ).subscribe((words: WordObject[]) => {
            this.words = words.sort((first, second) => first.level - second.level)
                .map(word => ({...word, color: getColor(word.level)}));
            this.changeDetection.detectChanges();
        });
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }
}
