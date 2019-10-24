import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Word } from '../../../app/Objects';
import { colorMaxLevel } from '../color.utils';

@Component({
    selector: 'app-word-popup',
    templateUrl: './word-popup.component.html',
    styleUrls: ['./word-popup.component.scss']
})
export class WordPopupComponent implements OnChanges {

    @Input()
    public word: Word;
    @Input()
    public isSelection: boolean = false;

    @Output()
    public wordEdit: EventEmitter<Word> = new EventEmitter<Word>();

    @ViewChild('translationField')
    public translationField: ElementRef<HTMLInputElement>;

    public translateForm: FormGroup;

    constructor(
        private readonly changeDetection: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
    ) {
    }


    public ngOnChanges(): void {
        if (this.word) {

            if (this.isSelection) {
                this.translateForm = this.formBuilder.group({
                    translation: new FormControl(this.word.translation),
                });
            } else {
                this.translateForm = this.formBuilder.group({
                    translation: new FormControl(this.word.translation),
                    exampleSentence: new FormControl(this.word.exampleSentence),
                    exampleSentenceTranslation: new FormControl(this.word.exampleSentenceTranslation),
                });
            }

            this.changeDetection.detectChanges();
            this.translationField.nativeElement.focus();
            this.changeDetection.detectChanges();
        }
    }


    public preventPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }


    public decreaseLevel(): void {
        this.word.level = this.word.level / 2;

        this.wordEdit.emit(this.word);
    }


    public increaseLevel(): void {
        if (this.word.level === 0) {
            this.word.level = 0.1;
        } else {
            this.word.level = this.word.level / 2 + colorMaxLevel / 2;
        }

        this.wordEdit.emit(this.word);
    }


    public setKnown(): void {
        this.word.level = colorMaxLevel;

        this.wordEdit.emit(this.word);
    }


    public updateTranslation(): void {
        this.word.translation = this.translateForm.get('translation').value;

        if (!this.isSelection) {
            this.word.exampleSentence = this.translateForm.get('exampleSentence').value;
            this.word.exampleSentenceTranslation = this.translateForm.get('exampleSentenceTranslation').value;
        }

        this.word.level = 0.1;

        this.wordEdit.emit(this.word);
    }

}
