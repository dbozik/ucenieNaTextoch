import { Observable, ReplaySubject } from 'rxjs';
import { TextObject } from '../Objects/TextObject';
import { Database } from './database';

export class Texts {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: string, title: string, userId: string, languageId: string)
        : Observable<TextObject> {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);

        this.db.texts.insert(
            {
                createdOn: new Date(),
                userId: userId,
                languageId: languageId,
                text: text,
                title: title
            },
            (error, dbText) => {
                textSource$.next(dbText);
                textSource$.complete();
            });

        return textSource$.asObservable();
    }

    public get(textId: string): Observable<TextObject> {
        const textSource$: ReplaySubject<TextObject> = new ReplaySubject(1);

        this.db.texts.findOne({_id: textId}, (error, text: TextObject) => {
            textSource$.next(text);
            textSource$.complete();
        });

        return textSource$.asObservable();
    }

    public getList(): Observable<TextObject[]> {
        const textSource$: ReplaySubject<TextObject[]> = new ReplaySubject(1);

        this.db.texts.find({}, (error, texts: TextObject[]) => {
            textSource$.next(texts);
        });

        return textSource$.asObservable();
    }

    public delete(textId): void {
        this.db.texts.remove({_id: textId});
    }
}
