import { Observable, ReplaySubject } from 'rxjs';
import { Text } from '../Objects';
import { Database } from './database';

export class TextsArchived {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: Text)
        : Observable<Text> {
        const textSource$: ReplaySubject<Text> = new ReplaySubject(1);

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

    public get(textId: string): Observable<Text> {
        const textSource$: ReplaySubject<Text> = new ReplaySubject(1);

        this.db.textsArchived.findOne({_id: textId}, (error, text: Text) => {
            textSource$.next(text);
        });

        return textSource$.asObservable();
    }

    public getList(): Observable<Text[]> {
        const textSource$: ReplaySubject<Text[]> = new ReplaySubject(1);

        this.db.textsArchived.find({}, (error, texts: Text[]) => {
            textSource$.next(texts);
        });

        return textSource$.asObservable();
    }
}
