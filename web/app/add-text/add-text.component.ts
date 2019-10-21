import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    providers: [TextService],
})
export class AddTextComponent implements OnInit {

    public textForm: FormGroup;

    @ViewChild('titleField')
    public titleField: ElementRef<HTMLInputElement>;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly textService: TextService,
    ) {
    }


    ngOnInit() {
        this.textForm = new FormGroup({
            title: new FormControl('', Validators.required),
            text: new FormControl('', Validators.required),
        });
        this.titleField.nativeElement.focus();
    }


    public save(): void {
        if (this.textForm.invalid) {
            return;
        }

        const newText: Text = {
            title: this.textForm.get('title').value,
            text: this.textForm.get('text').value,
        } as Text;

        this.textService.add(newText).subscribe();
    }

}
