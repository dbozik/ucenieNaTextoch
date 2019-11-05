import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
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
    public active: 'regular' | 'archived' = 'regular';
    public filterForm: FormGroup;

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
        private readonly changeDetection: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
    ) {
    }

    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            title: '',
            text: '',
            createdFrom: '',
            createdTo: '',
        });

        this.languageService.languageSelected$.pipe(
            takeUntil(this.componentDestroyed$),
        ).subscribe(() => {
            this.getRegularTexts();
        });
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }


    public textClick(textId: string): void {
        this.textService.openText(textId);
    }


    public filterTexts(): void {
        if (this.active === 'regular') {
            this.getRegularTexts();
        } else {
            this.getArchivedTexts();
        }
    }


    public resetFilter(): void {
        this.filterForm.setValue({
            title: '',
            text: '',
            createdFrom: '',
            createdTo: '',
        });

        this.filterTexts();
    }


    public getRegularTexts(): void {
        console.log('get regular texts');
        this.active = 'regular';

        this.textService.filterTexts({
            titleFragment: this.filterForm.get('title').value,
            textFragment: this.filterForm.get('text').value,
            createdFrom: this.filterForm.get('createdFrom').value,
            createdTo: this.filterForm.get('createdTo').value,
        }).subscribe((texts: Text[]) => {
            console.log('filtered texts');
            this.texts = texts.sort(
                (first, second) =>
                    (new Date(second.createdOn)).getTime() - (new Date(first.createdOn)).getTime()
            );
            this.changeDetection.detectChanges();
        });
    }


    public getArchivedTexts(): void {
        this.active = 'archived';

        this.texts = [];
        this.changeDetection.detectChanges();
    }

}
