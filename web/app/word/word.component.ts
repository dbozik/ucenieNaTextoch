import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import { TextPart } from '../../../app/Objects';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordComponent implements OnChanges {

    @Input()
    public textPart: TextPart;

    public popupShowed: boolean = false;

    public color: string;
    public title: string;

    private colorMaxLevel = 10000;

    constructor(
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnChanges() {
        if (this.textPart) {
            this.color = this.getColor(this.textPart.level);
            this.title = this.textPart.type === 'word' ? this.textPart.translation : '';
        }
    }


    public hasLineBreak(content: string): boolean {
        return content.includes('\n');
    }


    public clickPopup(): void {
        this.popupShowed = !this.popupShowed;
        this.changeDetection.detectChanges();
    }


    public decreaseLevel(): void {

    }


    public increaseLevel(): void {

    }


    public setKnown(): void {

    }


    public updateTranslation(): void {

    }


    private getColor(level: number): string {
        if (typeof level === 'undefined') {
            return '';
        }
        if (level === 0) {
            return 'rgb(150, 150, 150)';
        }
        const constantColor = 255;
        const linearColor = Math.ceil(255 * level / this.colorMaxLevel);
        const quadraticColor = Math.ceil(255 * level * level / this.colorMaxLevel / this.colorMaxLevel);

        return `rgb(${constantColor}, ${linearColor}, ${quadraticColor})`;
    }

}
