import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { GetRequestHandler, MethodHandler, SendRequestHandler } from '../Handlers';
import { Navigation } from '../navigation';
import { Word } from '../Objects';
import { ParseTextService } from './parseTextService';

export class WordService {
    private wordsDA = new DA.Words();

    public constructor() {
    }


    public init(): void {
        this.processEditWord();
        this.processGetWords();
        this.processOpenWordEdit();
        this.processGetWord();

        this.processSaveSelection();
    }


    public saveWords = (words: Word[]): Observable<Word[]> => {
        return this.wordsDA.getList(words.map(wordObject => wordObject.content)).pipe(
            switchMap((savedWordObjects: Word[]) => {
                const savedWords = savedWordObjects.map(wordObject => wordObject.content);
                const wordsToSave = words.filter(wordObject => !savedWords.includes(wordObject.content));

                return this.wordsDA.saveMultiple(wordsToSave);
            }),
        );
    }


    private processGetWord(): void {
        const getWordChain = new GetRequestHandler(ipcEvents.GET_WORD, (wordId: string) => this.wordsDA.getById(wordId));
        getWordChain.run({});
    }


    private processEditWord(): void {
        const editWord$ = (word: Word) => this.wordsDA.edit(word);

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


    private processSaveSelection(): void {
        let selection: Word = null;

        const saveSelectionChain = new GetRequestHandler(ipcEvents.SAVE_SELECTION, (word: Word) => this.wordsDA.saveMultiple([word]));
        saveSelectionChain.next(
            new SendRequestHandler((result: Word[]) => {
                selection = result[0];
                const parseService = new ParseTextService();

                const firstWord = (parseService.splitToParts(selection.content).filter(part => part.type === 'word'))[0]
                    .content.toLowerCase();

                return this.wordsDA.get(firstWord);
            })
        ).next(
            new MethodHandler((firstWord: Word) => {
                if (!firstWord.selectionsIds || firstWord.selectionsIds.length === 0) {
                    firstWord.selectionsIds = [];
                }
                firstWord.selectionsIds.push(selection._id);

                this.wordsDA.edit(firstWord).subscribe();
            })
        );

        saveSelectionChain.run({});
    }
}
