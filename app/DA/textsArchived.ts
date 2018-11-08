import { database } from "./database";
import { Observable, ReplaySubject } from "rxjs";
import { TextObject } from "../Objects/TextObject";

export class textsArchived {
    private db: database = new database();

    public constructor() { }

    public addText(text: TextObject)
    : Observable<TextObject> 
    {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);
        
        this.db.textsArchived.insert(
            { 
                userId: text.userId, 
                languageId: text.languageId, 
                text: text.text, 
                title: text.title, 
                createdOn: text.createdOn,
            },
        (error, dbText) => {
            textSource$.next(dbText);
            textSource$.complete();
        });

        return textSource$.asObservable();
    }

    public get(textId: string): Observable<TextObject> {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);

        this.db.textsArchived.findOne({_id: textId}, (error, text: TextObject) => {
            textSource$.next(text);
        });

        return textSource$.asObservable();
    }

    public getList(): Observable<TextObject[]> {
        const textSource$: ReplaySubject<TextObject[]> = new ReplaySubject(1);

        this.db.textsArchived.find({}, (error, texts: TextObject[]) => {
            textSource$.next(texts);
        });

        return textSource$.asObservable();
    }
}