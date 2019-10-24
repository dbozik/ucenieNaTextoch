import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Text, TextPart, Word } from '../../../app/Objects';
import { getColor } from '../color.utils';
import { ClickService } from '../services/click.service';
import { LanguageService } from '../services/language.service';
import { TextService } from '../services/text.service';

@Component({
    selector: 'app-read-text',
    templateUrl: './read-text.component.html',
    styleUrls: ['./read-text.component.scss'],
    providers: [ClickService, TextService, LanguageService],
})
export class ReadTextComponent implements OnInit {
    public text: Text;
    public translateLink: string = '';
    public percentage: number = 0;

    @ViewChild('translationField')
    public translationField: ElementRef<HTMLInputElement>;

    public selectionPopupShowed: boolean = false;
    public selectionForm: FormGroup;

    private languageDictionary: string;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly clickService: ClickService,
        private readonly languageService: LanguageService,
        private readonly textService: TextService,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        const textId = this.route.snapshot.params.id;

        this.textService.getParsed(textId).subscribe((result: Text) => {
            this.text = result;
            this.text.textParts = this.processTextParts(result.textParts);

            this.languageDictionary = this.text.languageDictionary;
            this.setTranslateLink('', this.languageDictionary);
            this.changeDetectorRef.detectChanges();
        });
    }


    public setTranslateLink(word: string, dictionary: string = this.languageDictionary): void {
        this.translateLink = dictionary.replace('{word}', word);
        this.changeDetectorRef.detectChanges();
    }


    public wordEdit(word: Word): void {
        this.textService.editWord(word).subscribe(() => {
            const editedTextParts: TextPart[] = [];

            for (const textPart of this.text.textParts) {
                if (textPart.type === 'word' && textPart.word._id === word._id) {
                    editedTextParts.push({
                        content: textPart.content,
                        type: 'word',
                        word,
                        color: getColor(word.level),
                        title: word.translation,
                    });
                } else {
                    editedTextParts.push(JSON.parse(JSON.stringify(textPart)));
                }
            }

            this.text.textParts = editedTextParts;
            this.changeDetectorRef.detectChanges();
        });
    }


    public onTextAreaClick(): void {
        const selection = window.getSelection();

        if (selection.type === 'Range') {
            this.processSelection(selection);
        }

        this.clickService.click();
    }


    public onLoaded(payload: { percentage: number }): void {
        this.percentage = payload.percentage;
        this.changeDetectorRef.detectChanges();
    }


    public saveSelection(): void {
        console.dir(this.selectionForm.value);
        this.selectionPopupShowed = false;
        this.changeDetectorRef.detectChanges();
    }


    private processTextParts(textParts: TextPart[]): TextPart[] {
        return textParts.map((textPart: TextPart) => ({
            ...textPart,
            color: textPart.type === 'word' ? getColor(textPart.word.level) : '',
            title: textPart.type === 'word' ? textPart.word.translation || '' : ''
        }));
    }


    private processSelection(selection: Selection): void {
        // get the first app-word node
        let firstNode: Node = selection.anchorNode;
        while (firstNode.nodeName !== 'APP-WORD') {
            firstNode = firstNode.parentElement;
        }

        // get the last text
        const lastText = selection.extentNode.textContent.trim();

        const selectionParts: string[] = [];
        let currentNode: Node = firstNode;

        do {
            // get the text on the app-word node
            currentNode.childNodes.forEach((node: Node) => {
                if (node.nodeName === 'SPAN') {
                    let nodeContent = node.textContent;
                    if (nodeContent[0] === ' ' && nodeContent[nodeContent.length - 1] === ' ') {
                        nodeContent = nodeContent.substring(1, nodeContent.length - 1);
                    }
                    selectionParts.push(nodeContent);
                }
            });
            currentNode = currentNode.nextSibling;
        } while (selectionParts.length === 0 || selectionParts[selectionParts.length - 1].trim() !== lastText);
        const selectionText = selectionParts.join('');
        this.setTranslateLink(selectionText);

        this.selectionForm = this.formBuilder.group({
            selection: selectionText,
            translation: this.formBuilder.control('', Validators.required),
        });

        this.selectionPopupShowed = true;
        this.changeDetectorRef.detectChanges();
    }
}
