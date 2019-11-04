import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { Word } from '../../../app/Objects';
import { getColor } from '../color.utils';
import { LanguageService } from '../services/language.service';
import { WordService } from '../services/word.service';

type Levels = 'unknown' | 'known' | 'learning';

@Component({
    selector: 'app-words',
    templateUrl: './words.component.html',
    styleUrls: ['./words.component.scss'],
    providers: [WordService, LanguageService],
})
export class WordsComponent implements OnInit, OnDestroy {

    public words: (Word | 'color')[] = [];
    public filterForm: FormGroup;

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly languageService: LanguageService,
        private readonly wordService: WordService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }


    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            word: '',
            level: 'unknown',
            levelFrom: new FormControl({value: '', disabled: true}, Validators.min(0)),
            levelTo: new FormControl({value: '', disabled: true}, Validators.max(100)),
        });

        this.languageService.languageSelected$.pipe(
            startWith(true),
            takeUntil(this.componentDestroyed$),
        ).subscribe(() => this.filterWords());

        this.filterForm.valueChanges.subscribe(() => {
            const levelChosen = !!this.filterForm.get('level').value;
            const levelFrom = this.filterForm.get('levelFrom');
            const levelTo = this.filterForm.get('levelTo');

            if (levelChosen) {
                levelFrom.disable({emitEvent: false});
                levelTo.disable({emitEvent: false});
            } else {
                levelFrom.enable({emitEvent: false});
                levelTo.enable({emitEvent: false});
            }

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


    public filterWords(): void {
        let minLevel: number = null;
        let maxLevel: number = null;

        const levelValue: Levels = this.filterForm.get('level').value;

        switch (levelValue) {
            case 'unknown':
                minLevel = 0;
                maxLevel = 0;
                break;
            case 'known':
                minLevel = 99;
                maxLevel = 100;
                break;
            case 'learning':
                minLevel = 0.001;
                maxLevel = 98.999;
                break;
            default:
                break;
        }

        this.wordService.getWords().subscribe((words: Word[]) => {
            this.words = words.sort((first, second) => first.level - second.level)
                .map(word => ({...word, color: getColor(word.level)}));
            this.changeDetection.detectChanges();
        });
    }


    public resetFilter(): void {
        this.filterForm.setValue({
            word: '',
            level: 'unknown',
            levelFrom: '',
            levelTo: '',
        });

        this.filterWords();
    }
}
