import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Language } from '../../../app/Objects';
import { Text } from '../../../app/Objects';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-add-text',
    templateUrl: './add-text.component.html',
    styleUrls: ['./add-text.component.scss'],
    providers: [LanguageService, TextService],
})
export class AddTextComponent implements OnInit {

    public textForm: FormGroup;

    public languages: Language[];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly languageService: LanguageService,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly textService: TextService,
    ) {
    }


    ngOnInit() {
        this.textForm = new FormGroup({
            title: new FormControl('', Validators.required),
            language: new FormControl(null, Validators.required),
            text: new FormControl('', Validators.required),
        });

        this.languageService.getLanguages().subscribe((languages: Language[]) => {
            this.languages = languages;
            this.changeDetector.detectChanges();
        });
    }


    public save(): void {
        if (this.textForm.invalid) {
            return;
        }

        const newText: Text = {
            title: this.textForm.get('title').value,
            languageId: this.textForm.get('language').value,
            text: this.textForm.get('text').value,
        };

        this.textService.add(newText).subscribe();
    }

}
