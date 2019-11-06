import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextArchiveService } from '../services/text-archive.service';
import { TextService } from '../services/text.service';

type TextType = 'regular' | 'archived';

@Component({
    selector: 'app-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.scss'],
    providers: [TextService, TextArchiveService, LanguageService],
})
export class TextsComponent implements OnInit, OnDestroy {
    public texts: Text[] = [];
    public active: TextType = 'regular';
    public filterForm: FormGroup;
    public loading: boolean = true;

    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private readonly languageService: LanguageService,
        private readonly textArchiveService: TextArchiveService,
        private readonly textService: TextService,
        private readonly changeDetection: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
    ) {
    }


    public get isRegularTexts(): boolean {
        return this.active === 'regular';
    }


    public get isArchivedTexts(): boolean {
        return this.active === 'archived';
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
            this.getTexts(this.active);
        });
    }


    public ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
    }


    public textClick(textId: string): void {
        if (this.isRegularTexts) {
            this.textService.openText(textId);
        }
    }


    public filterTexts(): void {
        this.getTexts(this.active);
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


    public getTexts(type: TextType): void {
        this.active = type;
        this.loading = true;
        this.texts = [];
        this.changeDetection.detectChanges();

        const loadTexts$ = type === 'regular' ? this.getRegularTexts() : this.getArchivedTexts();
        loadTexts$.subscribe((texts: Text[]) => {
            this.texts = texts.sort(
                (first, second) =>
                    (new Date(second.createdOn)).getTime() - (new Date(first.createdOn)).getTime()
            );
            this.loading = false;
            this.changeDetection.detectChanges();
        });
    }


    public openEdit(textId: string): void {
        this.textService.openTextEdit(textId);
    }


    public archive(textId: string): void {
        this.textArchiveService.archiveText(textId).subscribe(() => this.removeText(textId));
    }


    public unarchive(textId: string): void {
        this.textArchiveService.unarchiveText(textId).subscribe(() => this.removeText(textId));
    }


    private getRegularTexts(): Observable<Text[]> {
        return this.textService.filterTexts({
            titleFragment: this.filterForm.get('title').value,
            textFragment: this.filterForm.get('text').value,
            createdFrom: this.filterForm.get('createdFrom').value,
            createdTo: this.filterForm.get('createdTo').value,
        });
    }


    private getArchivedTexts(): Observable<Text[]> {
        return this.textArchiveService.getList();
    }


    private removeText(textId): void {
        this.texts = this.texts.filter(text => text._id !== textId);
        this.changeDetection.detectChanges();
    }

}
