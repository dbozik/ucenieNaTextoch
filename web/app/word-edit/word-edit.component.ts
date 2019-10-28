import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Language, Word } from '../../../app/Objects';
import { colorMaxLevel, getColor } from "../color.utils";
import { LanguageService } from '../services/language.service';
import { WordService } from '../services/word.service';

@Component({
    selector: 'app-word-edit',
    templateUrl: './word-edit.component.html',
    styleUrls: ['./word-edit.component.scss'],
    providers: [WordService, LanguageService],
})
export class WordEditComponent implements OnInit {


    public word: Word;
    public editForm: FormGroup;
    public languages: Language[];
    public color: string;
    public colorMaxLevel = colorMaxLevel;

    public successMessage = false;


    constructor(
        private readonly changeDetector: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly languageService: LanguageService,
        private readonly wordService: WordService,
    ) {
    }


    public ngOnInit(): void {
        const wordId = this.route.snapshot.params.id;

        this.wordService.getWord(wordId).subscribe((word: Word) => {
            this.word = word;
            this.color = getColor(this.word.level);

            this.languageService.getLanguages().subscribe((languages: Language[]) => {
                this.languages = languages;
                this.createForm();

                this.editForm.get('level').valueChanges.subscribe(() => {
                    this.color = getColor(this.editForm.get('level').value);
                    this.changeDetector.detectChanges();
                });

                this.changeDetector.detectChanges();
            });
        });
    }


    public submit(): void {
        if (this.editForm.invalid) {
            return;
        }

        this.wordService.editWord({...this.editForm.value, _id: this.word._id}).subscribe(() => {
            this.successMessage = true;
            this.changeDetector.detectChanges();
        });
    }


    public onClick(): void {
        this.successMessage = false;
    }


    private createForm(): void {
        this.editForm = this.formBuilder.group({
            content: this.word.content,
            translation: this.word.translation,
            exampleSentence: this.word.exampleSentence,
            exampleSentenceTranslation: this.word.exampleSentenceTranslation,
            level: new FormControl(this.word.level, Validators.max(colorMaxLevel)),
            languageId: this.word.languageId,
        });
    }
}
