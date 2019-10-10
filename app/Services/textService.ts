import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ParseTextService, StateService, WordService } from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler } from '../Handlers/get-request.handler';
import { IpcMainHandler } from '../Handlers/ipc-main.handler';
import { MethodHandler } from '../Handlers/method.handler';
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

        // get textParts
        // this.getText$(this._textId).subscribe(textDA => {
        //     const textParts = ParseTextService.splitToParts(textDA.text);
        //     const words = ParseTextService.extractWords(textParts);
        //
        //     this.wordsDA.getList(words).subscribe((wordObjects: WordObject[]) => {
        //         textDA.wordObjects = wordObjects;
        //         textDA.textParts = ParseTextService.completeTextParts(textParts, wordObjects);
        //
        //         this.textSource$.next(textDA);
        //     });
        // });
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


    public parseText(text: string, userId: number, languageId: number): any {
        // const wordsDA = new DA.Words();
        //
        // const words = ParseTextService.splitToWords(text);
        // const textParts = ParseTextService.splitToParts(text);
        //
        // const wordObjects: WordObject[] = [];
        // const getWords$: Observable<WordObject>[] = [];
        //
        // words.forEach(word => {
        //     const getWord$ = wordsDA.get(word).pipe(
        //         tap(wordObject => wordObjects.push(wordObject)),
        //     );
        //
        //     getWords$.push(getWord$);
        // });
        //
        // forkJoin(getWords$).subscribe(() => {
        //
        // });
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

    private getText$ = (textId: string) => this.textsDA.get(textId);


    private loadTextParsed$ = (textId: string): Observable<Text> => {
        let textParts: TextPart[] = [];
        let text: Text;
        let parseTextService: ParseTextService;

        return this.getText$(textId).pipe(
            switchMap((textDA: Text) => {
                text = textDA;

                return (new DA.Languages()).get(text.languageId);
            }),
            switchMap((language: Language) => {
                parseTextService = new ParseTextService(language.wordSeparators as RegExp);
                textParts = parseTextService.splitToParts(text.text);
                const words = parseTextService.extractWords(textParts);

                return this.wordsDA.getList(words);
            }),
            map((wordObjects: WordObject[]) => {
                text.wordObjects = wordObjects;
                text.textParts = parseTextService.completeTextParts(textParts, wordObjects);

                return text;
            }),
        );
    }


    private processSaveText(): void {
        const saveText$ = (text: Text) => {
            const userId = StateService.getInstance().userId;

            return (new WordService()).saveWords(text.text, userId, text.languageId).pipe(
                switchMap(() => {
                    return this.textsDA.addText(text.text, text.title, userId, text.languageId);
                })
            );
        };

        const getRequestHandler = new GetRequestHandler(ipcEvents.ADD_TEXT, saveText$);
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
        const getTexts$ = (languageId: string) => {
            const userId = StateService.getInstance().userId;

            return this.textsDA.getList(userId, languageId);
        };

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


    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }
}
