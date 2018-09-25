import * as path from 'path';
import {format, URL} from 'url';
import * as Datastore from 'nedb';
import { database } from './database';
import { ReplaySubject, Observable } from 'rxjs';
import { TextObject } from '../Objects/TextObject';

export class texts {
    private db: database = new database();

    public constructor() { }

    public addText(text: string, userId: number, languageId: number)
    : Observable<TextObject> 
    {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);
        
        this.db.texts.insert(
            { id: 1, userId: userId, languageId: languageId, text: text},
        (error, dbText) => {
            textSource$.next(dbText);
        });

        return textSource$.asObservable();
    }

    public get(textId: string): Observable<TextObject> {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);

        this.db.texts.findOne({_id: textId}, (error, text: TextObject) => {
            textSource$.next(text);
        });

        return textSource$.asObservable();
    }
}