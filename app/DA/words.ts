import { Observable, ReplaySubject } from 'rxjs';
import { WordObject } from '../Objects/namespace';
import { Database } from './database';

export class Words {
    public wordId: number;

    private db: Database = new Database();

    public constructor() {
    }

    public add(word: string, exampleSentence: string, languageId: string, userId: string)
        : Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        const newWord: WordObject = {
            word: word,
            exampleSentence: exampleSentence,
            level: 0,
            languageId: languageId,
            userId: userId,
        };
        this.db.words.insert(newWord, (error, dbWord) => {
            wordSource$.next(dbWord);
            wordSource$.complete();
        });

        return wordSource$.asObservable();
    }

    public get(word: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.findOne({word: word}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
            wordSource$.complete();
        });

        return wordSource$.asObservable();
    }

    public getById(id: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.findOne({_id: id}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
            wordSource$.complete();
        });

        return wordSource$.asObservable();
    }


    public getList(words: string[]): Observable<WordObject[]> {
        const wordsSource$: ReplaySubject<WordObject[]> = new ReplaySubject(1);

        this.db.words.find({word: {$in: words}}, (error, foundWords: WordObject[]) => {
            wordsSource$.next(foundWords);
            wordsSource$.complete();
        });

        return wordsSource$.asObservable();
    }


    public updateTranslation(id: string, translation: string): void {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.update(
            {_id: id},
            {$set: {translation: translation}},
            {},
        );
    }

    public updateLevel(id: string, level: number): void {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.update(
            {_id: id},
            {$set: {level: level}},
            {},
        );
    }
}
