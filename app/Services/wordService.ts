import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as DA from '../DA/namespace';
import { WordObject } from '../Objects';

export class WordService {
    private wordsDA = new DA.Words();

    public constructor() {
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


    public updateTranslation(id: string, translation: string): void {
        this.wordsDA.updateTranslation(id, translation);
    }

    public updateLevel(id: string, newLevel: number): void {
        this.wordsDA.updateLevel(id, newLevel);
    }
}
