import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler, MethodHandler } from '../Handlers';
import { Navigation } from '../navigation';
import { Text, TextPart, WordObject } from '../Objects';

export class WordService {
    private wordsDA = new DA.Words();

    public constructor() {
    }


    public init(): void {
        this.processEditWord();
        this.processGetWords();
        this.processOpenWordEdit();
    }


    public saveWords = (words: WordObject[]): Observable<WordObject[]> => {
        return this.wordsDA.getList(words.map(wordObject => wordObject.word)).pipe(
            switchMap((savedWordObjects: WordObject[]) => {
                const savedWords = savedWordObjects.map(wordObject => wordObject.word);
                const wordsToSave = words.filter(wordObject => !savedWords.includes(wordObject.word));

                return this.wordsDA.saveMultiple(wordsToSave);
            }),
        );
    }


    private processEditWord(): void {
        const editWord$ = (word: TextPart) => this.wordsDA.edit(word);

        const editWordChain = new GetRequestHandler(ipcEvents.EDIT_WORD, editWord$);

        editWordChain.run({});
    }


    private processGetWords(): void {
        const getWords$ = () => this.wordsDA.getByLanguage();

        const getWordsChain = new GetRequestHandler(ipcEvents.GET_WORDS, getWords$);
        getWordsChain.run({});
    }


    private processOpenWordEdit(): void {
        const openWordEditChain = new GetRequestHandler(ipcEvents.OPEN_WORD_EDIT, (wordId: string) => of(wordId));

        openWordEditChain
            .next(
                new MethodHandler((wordId: string) => (new Navigation()).openPage(`${Routes.WORD}/${wordId}`))
            );

        openWordEditChain.run({});
    }
}
