import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { Word } from '../../../app/Objects';
import { getColor } from '../color.utils';
import { LanguageService } from '../services/language.service';
import { WordService } from '../services/word.service';
import { ExportCsvUtils } from './export-csv.utils';

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
    public loading: boolean = true;

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly languageService: LanguageService,
        private readonly wordService: WordService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }


    ngOnInit() {
        this.setFilterForm();

        this.languageService.languageSelected$.pipe(
            startWith(true),
            takeUntil(this.componentDestroyed$),
        ).subscribe(() => this.filterWords());

        this.filterForm.valueChanges.subscribe(() => this.setLevelControlsDisabled());
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }


    public exportWords() {
        const csvBlob = ExportCsvUtils.exportToCsv(this.words as Word[]);
        const url = window.URL.createObjectURL(csvBlob);

        const downloadLink = document.createElement('a');
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
        const {levelFrom, levelTo}: { levelFrom: number, levelTo: number } = this.getLevelRange();
        const word = this.filterForm.get('word').value;
        this.words = [];
        this.loading = true;
        this.changeDetection.detectChanges();

        this.wordService.getWords({word, levelFrom, levelTo})
            .subscribe((words: Word[]) => {
                if (words) {
                    this.words = words.sort((first, second) => first.level - second.level)
                        .map(item => ({...item, color: getColor(item.level)}));
                }
                this.loading = false;

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

    private getLevelRange() {
        let levelFrom: number = null;
        let levelTo: number = null;

        const levelValue: Levels = this.filterForm.get('level').value;

        if (levelValue) {
            switch (levelValue) {
                case 'unknown':
                    levelFrom = 0;
                    levelTo = 0;
                    break;
                case 'known':
                    levelFrom = 99;
                    levelTo = 100;
                    break;
                case 'learning':
                    levelFrom = 0.001;
                    levelTo = 98.999;
                    break;
                default:
                    break;
            }
        } else {
            const levelFromValue: number = this.filterForm.get('levelFrom').value;
            const levelToValue: number = this.filterForm.get('levelTo').value;

            levelFrom = levelFromValue || null;
            levelTo = levelToValue || null;
        }
        return {levelFrom, levelTo};
    }

    private setFilterForm() {
        this.filterForm = this.formBuilder.group({
            word: '',
            level: 'unknown',
            levelFrom: new FormControl({value: '', disabled: true}, Validators.min(0)),
            levelTo: new FormControl({value: '', disabled: true}, Validators.max(100)),
        });
    }

    private setLevelControlsDisabled() {
        const levelChosen: boolean = !!this.filterForm.get('level').value;
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
    }
}
