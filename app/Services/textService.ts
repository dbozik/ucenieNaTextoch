import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ParseTextService, StateService, WordService } from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler, IpcMainHandler, MethodHandler } from '../Handlers';
import { Navigation } from '../navigation';
import { Language, Text, TextPart, WordObject } from '../Objects';

export class TextService {

    private textsDA = new DA.Texts();
    private textsArchivedDA = new DA.TextsArchived();
    private wordsDA = new DA.Words();
    private textParts: TextPart[] = [];
    private wordObjects: WordObject[] = [];

    private textSource$: BehaviorSubject<Text> = new BehaviorSubject(new Text());
    public text$: Observable<Text> = this.textSource$.asObservable();

    public constructor() {
    }

    private _textId: string;

    public set textId(textId: string) {
        this._textId = textId;
    }

    public init(): void {
        this.processSaveText();
        this.processGetText();
        this.processGetTextParsed();
        this.processGetTexts();
        this.processOpenText();
    }


    public getArchivedList(): Observable<Text[]> {
        const texts = new DA.TextsArchived();

        return texts.getList();
    }


    public updateTranslation(wordId: string, translation: string): void {
        this.wordObjects.find(wordObject => wordObject._id === wordId).translation = translation;

        this.textParts.filter(textPart => textPart.wordId === wordId)
            .forEach(textPart => textPart.translation = translation);

        // this.textPartsSource$.next(this.textParts);
        // this.wordObjectsSource$.next(this.wordObjects);
    }

    public updateLevel(wordId: string, level: number): void {
        this.wordObjects.find(wordObject => wordObject._id === wordId).level = level;

        this.textParts.filter(textPart => textPart.wordId === wordId)
            .forEach(textPart => textPart.level = level);

        // this.textPartsSource$.next(this.textParts);
        // this.wordObjectsSource$.next(this.wordObjects);
    }

    public archive(textId: string): Observable<boolean> {
        const resultSource$: Subject<boolean> = new ReplaySubject<boolean>(1);
        this.textsDA.get(textId).subscribe(text => {
            this.textsArchivedDA.addText(text);
            this.textsDA.delete(textId);

            resultSource$.next(true);
            resultSource$.complete();
        });

        return resultSource$.asObservable();
    }


    private processSaveText(): void {
        const getRequestHandler = new GetRequestHandler(ipcEvents.ADD_TEXT, this.saveText$);
        getRequestHandler
            .next(
                new MethodHandler((text: Text) => (new Navigation()).openPage(`${Routes.READ_TEXT}/${text._id}`))
            );
        getRequestHandler.run({});
    }


    private processGetText(): void {
        const getTextChain = new GetRequestHandler(ipcEvents.GET_TEXT, this.getText$);
        getTextChain.run({});
    }


    private processGetTexts(): void {
        const getTexts$ = () => this.textsDA.getList();

        const getTextsChain = new GetRequestHandler(ipcEvents.GET_TEXTS, getTexts$);
        getTextsChain.run({});
    }


    private processOpenText(): void {
        const openTextChain = new IpcMainHandler(ipcEvents.OPEN_TEXT);
        openTextChain
            .next(
                new MethodHandler<any>((textId: string) => (new Navigation()).openPage(`${Routes.READ_TEXT}/${textId}`))
            );
        openTextChain.run({});
    }


    private processGetTextParsed(): void {
        const getTextParsedChain = new GetRequestHandler(ipcEvents.GET_TEXT_PARSED, this.loadTextParsed$);
        getTextParsedChain.run({});
    }


    private getText$ = (textId: string) => this.textsDA.get(textId);


    private loadTextParsed$ = (textId: string): Observable<Text> => {
        let textParts: TextPart[] = [];
        let text: Text;
        let parseTextService: ParseTextService;

        return this.getText$(textId).pipe(
            switchMap((textDA: Text) => {
                text = textDA;

                const language = StateService.getInstance().language;
                parseTextService = new ParseTextService(language.wordSeparators, language.sentenceSeparators);
                textParts = parseTextService.splitToParts(text.text);
                const words = parseTextService.extractWords(textParts);

                return this.wordsDA.getList(words);
            }),
            map((wordObjects: WordObject[]) => {
                text.textParts = parseTextService.completeTextParts(textParts, wordObjects);

                return text;
            }),
        );
    }


    private saveText$ = (text: Text) => {
        return (new DA.Languages()).get(text.languageId).pipe(
            switchMap((language: Language) => {
                const parseTextService = new ParseTextService(language.wordSeparators, language.sentenceSeparators);
                const words = parseTextService.getWords(text);

                return (new WordService()).saveWords(words);
            }),
            switchMap(() => {
                return this.textsDA.addText(text.text, text.title);
            })
        );
    }
}
