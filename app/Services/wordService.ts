import { Observable, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as DA from '../DA/namespace';
import { WordObject } from '../Objects';

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


    public saveWords = (text: string, userId: string, languageId: string): Observable<WordObject[]> => {
        const sentences = text.split(/[.?!]+/)
            .filter(sentence => sentence !== '');

        let wordObjects: WordObject[] = [];

        sentences.forEach(sentence => {
            const words = sentence.split(/[\s,.?!;:_()\[\]/\\"-]+/)
                .filter(word => word !== '')
                .map(word => word.toLowerCase());

            words.forEach(word => {
                wordObjects.push({
                    word,
                    exampleSentence: sentence,
                    languageId,
                    userId,
                    level: 0,
                });
            });
        });

        wordObjects = this.uniqBy(wordObjects, 'word');

        return this.wordsDA.getList(wordObjects.map(wordObject => wordObject.word)).pipe(
            switchMap((savedWordObjects: WordObject[]) => {
                const savedWords = savedWordObjects.map(wordObject => wordObject.word);
                const wordsToSave = wordObjects.filter(wordObject => !savedWords.includes(wordObject.word));

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


    private uniqBy(array: any[], key: string): any[] {
        const seen = new Set();
        return array.filter(item => {
            const property = item[key]; // key(item);
            return seen.has(property) ? false : seen.add(property);
        });
    }
}
