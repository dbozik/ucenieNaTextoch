import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Language, Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-text-edit',
    templateUrl: './text-edit.component.html',
    styleUrls: ['./text-edit.component.scss'],
    providers: [TextService, LanguageService],
})
export class TextEditComponent implements OnInit {

    public text: Text;
    public editForm: FormGroup;
    public languages: Language[];
    public unsavedWords: string[];

    public successMessage = false;


    constructor(
        private readonly changeDetector: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
    ) {
    }


    public ngOnInit(): void {
        const textId = this.route.snapshot.params.id;

        this.textService.getParsed(textId).subscribe((text: Text) => {
            this.text = text;
            this.unsavedWords = text.unsavedWords || [];

            this.languageService.getLanguages().subscribe((languages: Language[]) => {
                this.languages = languages;
                this.createForm();

                this.changeDetector.detectChanges();
            });
        });
    }


    public submit(): void {
        if (this.editForm.invalid) {
            return;
        }

        this.textService.edit({...this.text,  ...this.editForm.value}).subscribe(() => {
            this.successMessage = true;
            this.changeDetector.detectChanges();
        });
    }


    public onClick(): void {
        this.successMessage = false;
    }


    private createForm(): void {
        this.editForm = this.formBuilder.group({
            title: this.text.title,
            text: this.text.text,
            languageId: this.text.languageId,
        });
    }

}
