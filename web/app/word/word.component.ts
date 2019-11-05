import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output
} from '@angular/core';
import { take } from 'rxjs/operators';
import { TextPart, Word } from '../../../app/Objects';
import { getColor } from '../color.utils';
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

    public popupWord: Word = null;
    public popupSelection: Word = null;


    constructor(
        private readonly changeDetection: ChangeDetectorRef,
        private readonly clickService: ClickService,
    ) {
    }

    ngOnChanges() {
        if (this.textPart) {
            this.popupWord = null;
            this.popupSelection = null;
        }
    }


    public hasLineBreak(content: string): boolean {
        return content.includes('\n');
    }


    public clickPopup(): void {
        if (this.textPart.type === 'separator') {
            return;
        }

        this.openTranslation.emit(this.textPart.content);
        this.popupWord = this.textPart.word;
        this.changeDetection.detectChanges();

        this.closePopupOnClick();
    }


    public preventPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }


    public onWordEdit(word: Word): void {
        this.wordEdit.emit(word);
        this.popupWord = null;
        this.changeDetection.detectChanges();
    }


    public clickSelection(selection: Word): void {
        this.popupSelection = selection;
        this.changeDetection.detectChanges();

        this.closePopupOnClick();
    }


    public getColor(level: number): string {
        return getColor(level);
    }


    private closePopupOnClick(): void {
        this.clickService.wordClicked$.pipe(
            take(1),
        ).subscribe(() => {
            if (this.popupWord || this.popupSelection) {
                this.popupWord = null;
                this.popupSelection = null;
                this.changeDetection.detectChanges();
            }
        });
    }
}
