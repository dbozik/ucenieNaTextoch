import { Observable, ReplaySubject } from 'rxjs';
import * as DA from '../DA/namespace';
import { WordObject } from '../Objects/namespace';

export class WordService {
    private wordsDA = new DA.Words();

    public constructor() {
    }

    public getWord(word: string, exampleSentence: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        const words = new DA.Words();

        words.get(word).subscribe(retrievedWord => {
            if (retrievedWord) {
                wordSource$.next(retrievedWord);
            } else {
                words.add(word, exampleSentence, '1', '1').subscribe(addedWord => {
                    wordSource$.next(addedWord);
                });
            }
        });

        return wordSource$.asObservable();
    }

    public updateTranslation(id: string, translation: string): void {
        this.wordsDA.updateTranslation(id, translation);
    }

    public updateLevel(id: string, newLevel: number): void {
        this.wordsDA.updateLevel(id, newLevel);
    }
}
