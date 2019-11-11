import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ParseTextService, StateService, WordService } from '.';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler, IpcMainHandler, MethodHandler } from '../Handlers';
import { Navigation } from '../navigation';
import { Text, TextPart, TextsSearch, Word } from '../Objects';

export class TextService {

    private textsDA = new DA.Texts();
    private wordsDA = new DA.Words();

    public constructor() {
    }


    public init(): void {
        this.processSaveText();
        this.processEditText();
        this.processGetText();
        this.processGetTextParsed();
        this.processGetTexts();
        this.processOpenText();
        this.processOpenTextEdit();
    }


    private processSaveText(): void {
        const getRequestHandler = new GetRequestHandler(ipcEvents.ADD_TEXT, this.saveText$);
        getRequestHandler
            .next(
                new MethodHandler((text: Text) => (new Navigation()).openPage([Routes.READ_TEXT, text._id]))
            );
        getRequestHandler.run({});
    }


    private processEditText(): void {
        const editTextChain = new GetRequestHandler(ipcEvents.EDIT_TEXT, this.editText$);
        editTextChain.run({});
    }


    private processGetText(): void {
        const getTextChain = new GetRequestHandler(ipcEvents.GET_TEXT, this.getText$);
        getTextChain.run({});
    }


    private processOpenText(): void {
        const openTextChain = new IpcMainHandler(ipcEvents.OPEN_TEXT);
        openTextChain
            .next(
                new MethodHandler<any>((textId: string) => (new Navigation()).openPage([Routes.READ_TEXT, textId]))
            );
        openTextChain.run({});
    }


    private processOpenTextEdit(): void {
        const openTextEditChain = new IpcMainHandler(ipcEvents.OPEN_TEXT_EDIT);
        openTextEditChain
            .next(
                new MethodHandler<any>((textId: string) => (new Navigation()).openPage([Routes.EDIT_TEXT, textId]))
            );
        openTextEditChain.run({});
    }


    private processGetTextParsed(): void {
        const getTextParsedChain = new GetRequestHandler(ipcEvents.GET_TEXT_PARSED, this.loadTextParsed$);
        getTextParsedChain.run({});
    }


    private processGetTexts(): void {
        let texts: Text[] = [];
        let parseTextService: ParseTextService;

        const getTexts$ = (textsFilter: TextsSearch) =>
            this.textsDA.getListFiltered(
                textsFilter.titleFragment,
                textsFilter.textFragment,
                textsFilter.createdFrom,
                textsFilter.createdTo
            ).pipe(
                switchMap((textsResult: Text[]) => {
                    texts = textsResult;
                    parseTextService = new ParseTextService();

                    const words: string[] = [];
                    texts.forEach(text => {
                        text.textParts = parseTextService.splitToParts(text.text);
                        words.push(...parseTextService.extractWords(text.textParts));
                    });

                    return this.wordsDA.getList(words);
                }),
                map((words: Word[]) => {
                    texts.forEach((text: Text) => {
                        text.textParts = parseTextService.completeTextParts(text.textParts, words);
                        text.percentageUnknown = Text.getPercentageUnknown(text);
                        text.percentageLearning = Text.getPercentageLearning(text);
                    });

                    return texts;
                }),
            );

        const filterTextsChain = new GetRequestHandler(ipcEvents.FILTER_TEXTS, getTexts$);

        filterTextsChain.run({});
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
                text.languageDictionary = language.dictionary;

                parseTextService = new ParseTextService();
                textParts = parseTextService.splitToParts(text.text);
                const words = parseTextService.extractWords(textParts);

                return this.wordsDA.getList(words);
            }),
            map((wordObjects: Word[]) => {
                text.textParts = parseTextService.completeTextParts(textParts, wordObjects);
                text.unsavedWords = Array.from(parseTextService.unsavedWords);
                text.percentageUnknown = Text.getPercentageUnknown(text);
                text.percentageLearning = Text.getPercentageLearning(text);

                return text;
            }),
        );
    }


    private saveText$ = (text: Text) => {
        const language = StateService.getInstance().language;
        text.languageId = language._id;

        return this.saveWords$(text).pipe(
            switchMap(() => {
                return this.textsDA.addText(text.text, text.title);
            })
        );
    }


    private editText$ = (text: Text) => {
        return this.saveWords$(text).pipe(
            switchMap(() => this.textsDA.editText(text))
        );
    }


    private saveWords$ = (text: Text) => {
        const parseTextService = new ParseTextService();
        const words = parseTextService.getWords(text);

        return (new WordService()).saveWords(words);
    }

}
