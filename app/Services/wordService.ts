import * as DA from "../DA/namespace";
import { Observable, ReplaySubject } from "rxjs";
import { WordObject } from "../Objects/namespace";

export class wordService {
    constructor() { }

    getWord(word: string, exampleSentence: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        const words = new DA.words();

        words.get(word).subscribe(retrievedWord => {
            if (retrievedWord) {
                wordSource$.next(retrievedWord);
            } else {
                words.add(word, exampleSentence).subscribe(addedWord => {
                    wordSource$.next(addedWord);
                });
            }
        });

        return wordSource$.asObservable();
    }
}
