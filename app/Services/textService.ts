import { BehaviorSubject, combineLatest, forkJoin, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler } from '../Handlers/get-request.handler';
import { IpcMainHandler } from '../Handlers/ipc-main.handler';
import { MethodHandler } from '../Handlers/method.handler';
import { Navigation } from '../navigation';
import { Text, TextPart, WordObject } from '../Objects';
import { ParseTextService } from './parseTextService';
import { StateService } from './stateService';

export class TextService {

    private textsDA = new DA.Texts();
    private textsArchivedDA = new DA.TextsArchived();
    private wordsDA = new DA.Words();
    private textParts: TextPart[] = [];
    private wordObjects: WordObject[] = [];
    private textPartsSource$: BehaviorSubject<TextPart[]> = new BehaviorSubject([]);
    public textParts$: Observable<TextPart[]> = this.textPartsSource$.asObservable();
    private wordObjectsSource$: BehaviorSubject<WordObject[]> = new BehaviorSubject([]);
    public wordObjects$: Observable<WordObject[]> = this.wordObjectsSource$.asObservable();
    private textSource$: BehaviorSubject<Text> = new BehaviorSubject(new Text());
    public text$: Observable<Text> = this.textSource$.asObservable();

    public constructor() {
    }

    private _textId: string;

    public set textId(textId: string) {
        this._textId = textId;

        // get textParts
        this.textsDA.get(this._textId).subscribe(textDA => {
            this.textSource$.next(textDA);
            this.textParts = ParseTextService.splitToParts(textDA.text);

            this.textPartsSource$.next(this.textParts);
        });

        // get wordObjects
        this.textParts$.subscribe(textParts => {
            const words = textParts.filter(textPart => textPart.type === 'word')
                .map(textPart => textPart.content.toLowerCase())
                .filter((word, index, list) => list.indexOf(word) === index);

            const getWordObjects$: Observable<WordObject>[] = [];

            words.forEach(word => {
                const getWordObject$ = this.wordsDA.get(word).pipe(
                    tap(wordObject => this.wordObjects.push(wordObject))
                );
                getWordObjects$.push(getWordObject$);
            });

            combineLatest(getWordObjects$).subscribe(() =>
                this.wordObjectsSource$.next(this.wordObjects)
            );
        });

        // append wordIds to textParts
        combineLatest(this.wordObjects$, this.textParts$).pipe(
            first(([wordObjects, textParts]: [WordObject[], TextPart[]]) => {
                return wordObjects.length > 0 && textParts.length > 0;
            })
        )
            .subscribe(
                ([wordObjects, textParts]: [WordObject[], TextPart[]]) => {
                    wordObjects.forEach(wordObject => {
                        textParts.filter(textPart =>
                            textPart.content.toLowerCase() === wordObject.word)
                            .forEach(textPart => {
                                textPart.wordId = wordObject._id;
                                textPart.translation = wordObject.translation;
                                textPart.level = wordObject.level;
                                textPart.exampleSentence = wordObject.exampleSentence;
                            });
                    });
                    this.textPartsSource$.next(textParts);
                });
    }

    public init(): void {
        this.saveText();
        this.getText();
        this.getTexts();
        this.openText();
    }


    public getArchivedList(): Observable<Text[]> {
        const texts = new DA.TextsArchived();

        return texts.getList();
    }


    public parseText(text: string, userId: number, languageId: number): any {
        const wordsDA = new DA.Words();

        const words = ParseTextService.splitToWords(text);
        const textParts = ParseTextService.splitToParts(text);

        const wordObjects: WordObject[] = [];
        const getWords$: Observable<WordObject>[] = [];

        words.forEach(word => {
            const getWord$ = wordsDA.get(word).pipe(
                tap(wordObject => wordObjects.push(wordObject)),
            );

            getWords$.push(getWord$);
        });

        forkJoin(getWords$).subscribe(() => {

        });
    }

    public updateTranslation(wordId: string, translation: string): void {
        this.wordObjects.find(wordObject => wordObject._id === wordId).translation = translation;

        this.textParts.filter(textPart => textPart.wordId === wordId)
            .forEach(textPart => textPart.translation = translation);

        this.textPartsSource$.next(this.textParts);
        this.wordObjectsSource$.next(this.wordObjects);
    }

    public updateLevel(wordId: string, level: number): void {
        this.wordObjects.find(wordObject => wordObject._id === wordId).level = level;

        this.textParts.filter(textPart => textPart.wordId === wordId)
            .forEach(textPart => textPart.level = level);

        this.textPartsSource$.next(this.textParts);
        this.wordObjectsSource$.next(this.wordObjects);
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


    private saveText(): void {
        const saveText$ = (text: Text) => {
            const userId = StateService.getInstance().userId;

            return this.saveWords(text.text, userId, text.languageId).pipe(
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

    private saveWords = (text: string, userId: string, languageId: string): Observable<boolean> => {
        const wordsDA = new DA.Words();

        const sentences = text.split(/[.?!]+/)
            .filter(sentence => sentence !== '');

        let wordObjects = [];

        sentences.forEach(sentence => {
            const words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
                .filter(word => word !== '')
                .map(word => word.toLowerCase());

            words.forEach(word => {
                wordObjects.push({
                    word: word,
                    sentence: sentence,
                });
            });
        });

        wordObjects = this.uniqBy(wordObjects, 'word');

        const getWords$: Observable<WordObject>[] = [];

        wordObjects.forEach(wordObject => {
            const getWord$ = wordsDA.get(wordObject.word).pipe(
                switchMap(wordObjectDb => {
                    if (!wordObjectDb) {
                        return wordsDA.add(wordObject.word, wordObject.sentence, languageId, userId);
                    } else {
                        return of(wordObjectDb);
                    }
                })
            );
            getWords$.push(getWord$);
        });

        return forkJoin(getWords$).pipe(switchMap(() => of(true)));
    }


    private getText(): void {
        const getText$ = (textId: string) => this.textsDA.get(textId);

        const getTextChain = new GetRequestHandler(ipcEvents.GET_TEXT, getText$);
        getTextChain.run({});
    }


    private getTexts(): void {
        const getTexts$ = (languageId: string) => {
            const userId = StateService.getInstance().userId;

            return this.textsDA.getList(userId, languageId);
        };

        const getTextsChain = new GetRequestHandler(ipcEvents.GET_TEXTS, getTexts$);
        getTextsChain.run({});
    }


    private openText(): void {
        const openTextChain = new IpcMainHandler(ipcEvents.OPEN_TEXT);
        openTextChain
            .next(
                new MethodHandler<any>((textId: string) => (new Navigation()).openPage(`${Routes.READ_TEXT}/${textId}`))
            );
        openTextChain.run({});
    }

    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }
}
