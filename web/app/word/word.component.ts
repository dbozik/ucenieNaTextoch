import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TextPart, Word } from '../../../app/Objects';
import { colorMaxLevel } from '../color.utils';
import { ClickService } from '../services/click.service';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent implements OnChanges {

    @Input()
    public textPart: TextPart;

    @Output()
    public wordEdit: EventEmitter<Word> = new EventEmitter<Word>();
    @Output()
    public openTranslation: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('translationField')
    public translationField: ElementRef<HTMLInputElement>;

    public popupShowed: boolean = false;
    public translateForm: FormGroup;


    constructor(
        private readonly changeDetection: ChangeDetectorRef,
        private readonly clickService: ClickService,
    ) {
    }

    ngOnChanges() {
        if (this.textPart) {
            this.popupShowed = false;
        }
    }


    public hasLineBreak(content: string): boolean {
        return content.includes('\n');
    }


    public clickPopup(): void {
        if (this.textPart.type === 'separator') {
            return;
        }

        if (!this.popupShowed) {
            this.popupShowed = true;

            this.translateForm = new FormGroup({
                translation: new FormControl(this.textPart.word.translation),
                exampleSentence: new FormControl(this.textPart.word.exampleSentence),
                exampleSentenceTranslation: new FormControl(this.textPart.word.exampleSentenceTranslation),
            });
            this.openTranslation.emit(this.textPart.content);
            this.changeDetection.detectChanges();
            this.translationField.nativeElement.focus();
            this.changeDetection.detectChanges();

            this.clickService.wordClicked$.pipe(
                take(1),
            ).subscribe(() => {
                this.popupShowed = false;
                this.changeDetection.detectChanges();
            });
        }
    }


    public preventPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }


    public decreaseLevel(): void {
        this.textPart.word.level = this.textPart.word.level / 2;

        this.wordEdit.emit(this.textPart.word);
    }


    public increaseLevel(): void {
        if (this.textPart.word.level === 0) {
            this.textPart.word.level = 0.1;
        } else {
            this.textPart.word.level = this.textPart.word.level / 2 + colorMaxLevel / 2;
        }

        this.wordEdit.emit(this.textPart.word);
    }


    public setKnown(): void {
        this.textPart.word.level = colorMaxLevel;

        this.wordEdit.emit(this.textPart.word);
    }


    public updateTranslation(): void {
        this.textPart.word.translation = this.translateForm.get('translation').value;
        this.textPart.word.exampleSentence = this.translateForm.get('exampleSentence').value;
        this.textPart.word.exampleSentenceTranslation = this.translateForm.get('exampleSentenceTranslation').value;

        this.textPart.word.level = 0.1;

        this.wordEdit.emit(this.textPart.word);
    }
}
