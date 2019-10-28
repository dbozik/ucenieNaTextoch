import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.scss'],
    providers: [TextService, LanguageService],
})
export class TextsComponent implements OnInit, OnDestroy {
    public texts: Text[] = [];
    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.languageService.languageSelected$.pipe(
            startWith(true),
            takeUntil(this.componentDestroyed$),
            switchMap(() => {
                return this.textService.getTexts();
            })
        ).subscribe((texts: Text[]) => {
            this.texts = texts.sort(
                (first, second) =>
                    (new Date(second.createdOn)).getTime() - (new Date(first.createdOn)).getTime()
            );
            this.changeDetection.detectChanges();
        });
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }


    public textClick(textId: string): void {
        this.textService.openText(textId);
    }

}
