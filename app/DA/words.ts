import { Observable, ReplaySubject } from 'rxjs';
import { TextPart, WordObject } from '../Objects/namespace';
import { StateService } from "../Services";
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


    public saveMultiple(words: WordObject[]): Observable<WordObject[]> {
        const wordsSource$: ReplaySubject<WordObject[]> = new ReplaySubject(1);

        setTimeout(() => {
            this.db.words.insert(words, (error, dbWords) => {
                wordsSource$.next(dbWords);
                wordsSource$.complete();
            });
        }, 100);
        this.db.words.persistence.compactDatafile();

        return wordsSource$.asObservable();
    }


    public get(word: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.findOne({word}, (error, foundWord: WordObject) => {
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

        const userId = StateService.getInstance().userId;
        const languageId = StateService.getInstance().language._id;

        this.db.words.find({word: {$in: words}, languageId, userId}, (error, foundWords: WordObject[]) => {
            wordsSource$.next(foundWords);
            wordsSource$.complete();
        });

        return wordsSource$.asObservable();
    }


    public edit(word: TextPart): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        setTimeout(() => {
            this.db.words.update(
                {_id: word.wordId},
                {
                    $set: {
                        word: word.content,
                        level: word.level,
                        translation: word.translation,
                        exampleSentence: word.exampleSentence,
                        exampleSentenceTranslation: word.exampleSentenceTranslation,
                    }
                },
                {},
                (error, affectedNumber, editedWord: WordObject) => {
                    wordSource$.next(editedWord);
                    wordSource$.complete();
                });
        }, 100);
        this.db.words.persistence.compactDatafile();

        return wordSource$.asObservable();
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
