import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA';
import { GetRequestHandler } from '../Handlers';
import { TextPart, WordObject } from '../Objects';

export class WordService {
    private wordsDA = new DA.Words();

    public constructor() {
    }


    public init(): void {
        this.processEditWord();
        this.processGetWords();
    }


    public saveWords = (words: WordObject[], languageId: string): Observable<WordObject[]> => {
        return this.wordsDA.getList(words.map(wordObject => wordObject.word), languageId).pipe(
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
}
