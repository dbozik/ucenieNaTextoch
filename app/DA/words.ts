import * as path from 'path';
import {format, URL} from 'url';
import * as Datastore from 'nedb';
import {Observable, ReplaySubject} from 'rxjs';
import { WordObject } from '../Objects/namespace';

export class words {
    public wordId: number;

    public constructor() { }

    public add(word: string, exampleSentence: string): Observable<string> {
        const wordSource: ReplaySubject<string> = new ReplaySubject(1);

        const db:  {words: Datastore} = {words: null};
        db.words = new Datastore({
          filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
          autoload: true
        });

        const newWord: WordObject = {
            word: word,
            exampleSentence: exampleSentence,
            level: 0,
            languageId: 1,
        };
        db.words.insert(newWord, (error, dbWord) => {
            wordSource.next(dbWord._id);
        });

        return wordSource.asObservable();
    }

    public get(word: string): Observable<WordObject> {
        const wordSource: ReplaySubject<WordObject> = new ReplaySubject(1);

        const db:  {words: Datastore} = {words: null};
        db.words = new Datastore({
          filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
          autoload: true
        });

        db.words.findOne({word: word}, (error, foundWord) => {
            wordSource.next(foundWord);
        });

        return wordSource.asObservable();
    }
}