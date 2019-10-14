import { Observable, ReplaySubject } from 'rxjs';
import { Text } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Texts {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: string, title: string)
        : Observable<Text> {
        const textSource$: ReplaySubject<Text> = new ReplaySubject(1);

        setTimeout(() => {
            this.db.texts.insert(
                {
                    ...this.userLanguageRequest(),
                    createdOn: new Date(),
                    text,
                    title,
                },
                (error, dbText) => {
                    textSource$.next(dbText);
                    textSource$.complete();
                });
        }, 100);
        this.db.texts.persistence.compactDatafile();

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

    public getList(): Observable<Text[]> {
        const textSource$: ReplaySubject<Text[]> = new ReplaySubject(1);

        this.db.texts.find({...this.userLanguageRequest()}, (error, texts: Text[]) => {
            textSource$.next(texts);
        });

        return textSource$.asObservable();
    }

    public delete(textId): void {
        this.db.texts.remove({_id: textId});
    }


    private userLanguageRequest(): {userId: string, languageId: string} {
        const userId = StateService.getInstance().userId;
        const languageId = StateService.getInstance().language._id;

        return {userId, languageId};
    }
}
