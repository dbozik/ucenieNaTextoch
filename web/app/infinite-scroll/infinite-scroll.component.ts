import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'app-infinite-scroll',
    templateUrl: './infinite-scroll.component.html',
    styleUrls: ['./infinite-scroll.component.scss']
})
export class InfiniteScrollComponent<T = any> implements OnChanges {

    @Input()
    public items: T[] = [];

    public displayedItems: T[] = [];

    @Output()
    public loaded: EventEmitter<number> = new EventEmitter();

    @ViewChild('scrollBox')
    public scrollBox: ElementRef<HTMLElement>;

    @ContentChild(TemplateRef)
    public itemRef: TemplateRef<HTMLElement>;

    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnChanges() {
        for (let index = 0; index < this.displayedItems.length; index++) {
            this.displayedItems[index] = this.items[index];
        }

        if (this.displayedItems.length === 0) {
            const interval = setInterval(() => {
                if (this.scrollBox) {
                    while (this.scrollEnd() && this.displayedItems.length < this.items.length) {
                        this.addDisplayedItems();
                    }

                    clearInterval(interval);
                }
            }, 100);
        }
    }


    public onScroll(): void {
        if (this.scrollEnd()) {
            this.addDisplayedItems();
        }
    }


    private addDisplayedItems(): void {
        if (this.displayedItems.length >= this.items.length) {
            return;
        }

        const lowerIndex = this.displayedItems.length;
        const upperIndex = Math.min(lowerIndex + 100, this.items.length);
        this.displayedItems.push(...this.items.map(item => item).slice(lowerIndex, upperIndex));
        this.changeDetectorRef.detectChanges();
    }


    private scrollEnd(): boolean {
        if (!this.scrollBox) {
            return false;
        }

        const scrollElement = this.scrollBox.nativeElement;

        return scrollElement.offsetHeight + scrollElement.scrollTop >= scrollElement.scrollHeight;
    }
}
