import { Observable, Subject } from 'rxjs';
import { TextPart, WordObject } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Words {
    private db: Database = new Database();

    public constructor() {
    }

    public add(word: string, exampleSentence: string, languageId: string, userId: string)
        : Observable<WordObject> {
        const wordSource$: Subject<WordObject> = new Subject();

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
        const wordsSource$: Subject<WordObject[]> = new Subject();

        this.db.words.insert(words, (error, dbWords) => {
            wordsSource$.next(dbWords);
            wordsSource$.complete();
        });

        return wordsSource$.asObservable();
    }


    public get(word: string): Observable<WordObject> {
        const wordSource$: Subject<WordObject> = new Subject();

        this.db.words.findOne({word: word}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
            wordSource$.complete();
        });

        return wordSource$.asObservable();
    }

    public getById(id: string): Observable<WordObject> {
        const wordSource$: Subject<WordObject> = new Subject();

        this.db.words.findOne({_id: id}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
            wordSource$.complete();
        });

        return wordSource$.asObservable();
    }


    public getList(words: string[], languageId: string): Observable<WordObject[]> {
        const wordsSource$: Subject<WordObject[]> = new Subject();
        const userId = StateService.getInstance().userId;

        this.db.words.find({word: {$in: words}, userId, languageId}, (error, foundWords: WordObject[]) => {
            wordsSource$.next(foundWords);
            wordsSource$.complete();
        });

        return wordsSource$.asObservable();
    }

    public getByLanguage(languageId: string): Observable<WordObject[]> {
        const wordsSource$: Subject<WordObject[]> = new Subject();
        const userId = StateService.getInstance().userId;

        this.db.words.find({userId, languageId}, (error, foundWords: WordObject[]) => {
            wordsSource$.next(foundWords);
            wordsSource$.complete();
        });

        return wordsSource$.asObservable();
    }


    public edit(word: TextPart): Observable<WordObject> {
        const wordSource$: Subject<WordObject> = new Subject();

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
                this.db.words.persistence.compactDatafile();
                wordSource$.next(editedWord);
                wordSource$.complete();
            });

        return wordSource$.asObservable();
    }


    public updateTranslation(id: string, translation: string): void {
        const wordSource$: Subject<WordObject> = new Subject();

        this.db.words.update(
            {_id: id},
            {$set: {translation: translation}},
            {},
        );
    }

    public updateLevel(id: string, level: number): void {
        const wordSource$: Subject<WordObject> = new Subject();

        this.db.words.update(
            {_id: id},
            {$set: {level: level}},
            {},
        );
    }
}
