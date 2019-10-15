import { Observable, ReplaySubject, Subject } from 'rxjs';
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

    public constructor() {
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
                parseTextService = new ParseTextService(language.wordSeparators, language.sentenceSeparators);
                textParts = parseTextService.splitToParts(text.text);
                const words = parseTextService.extractWords(textParts);

                return this.wordsDA.getList(words, language._id);
            }),
            map((wordObjects: WordObject[]) => {
                text.textParts = parseTextService.completeTextParts(textParts, wordObjects);

                return text;
            }),
        );
    }


    private saveText$ = (text: Text) => {
        const userId = StateService.getInstance().userId;

        return (new DA.Languages()).get(text.languageId).pipe(
            switchMap((language: Language) => {
                const parseTextService = new ParseTextService(language.wordSeparators, language.sentenceSeparators);
                const words = parseTextService.getWords(text, userId);

                return (new WordService()).saveWords(words, language._id);
            }),
            switchMap(() => {
                return this.textsDA.addText(text.text, text.title, userId, text.languageId);
            })
        );
    }
}
