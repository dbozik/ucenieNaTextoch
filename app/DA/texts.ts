import { Observable, ReplaySubject } from 'rxjs';
import { Text } from '../Objects/Text';
import { Database } from './database';

export class Texts {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: string, title: string, userId: string, languageId: string)
        : Observable<Text> {
        const textSource$: ReplaySubject<Text> = new ReplaySubject(1);

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

    public get(textId: string): Observable<Text> {
        const textSource$: ReplaySubject<Text> = new ReplaySubject(1);

        this.db.texts.findOne({_id: textId}, (error, text: Text) => {
            textSource$.next(text);
            textSource$.complete();
        });

        return textSource$.asObservable();
    }

    public getList(userId: string, languageId: string): Observable<Text[]> {
        const textSource$: ReplaySubject<Text[]> = new ReplaySubject(1);

        this.db.texts.find({userId, languageId}, (error, texts: Text[]) => {
            textSource$.next(texts);
        });

        return textSource$.asObservable();
    }

    public delete(textId): void {
        this.db.texts.remove({_id: textId});
    }
}
