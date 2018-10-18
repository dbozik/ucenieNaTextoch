import * as path from 'path';
import {format, URL} from 'url';
import * as Datastore from 'nedb';
import {Observable, ReplaySubject} from 'rxjs';
import { WordObject } from '../Objects/namespace';
import { database } from './database';

export class words {
    public wordId: number;

    private db: database = new database();

    public constructor() { }

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
        });

        return wordSource$.asObservable();
    }

    public get(word: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.findOne({word: word}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
        });

        return wordSource$.asObservable();
    }

    public getById(id: string): Observable<WordObject> {
        const wordSource$: ReplaySubject<WordObject> = new ReplaySubject(1);

        this.db.words.findOne({_id: id}, (error, foundWord: WordObject) => {
            wordSource$.next(foundWord);
        });

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