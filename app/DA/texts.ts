import { Observable } from 'rxjs';
import { Text } from '../Objects';
import { Database } from './database';

export class Texts {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: string, title: string, userId: string, languageId: string)
        : Observable<Text> {
        return this.db.texts.insert$(
            {
                createdOn: new Date(),
                userId: userId,
                languageId: languageId,
                text: text,
                title: title
            });
    }


    public get(textId: string): Observable<Text> {
        return this.db.texts.findOne$({_id: textId});
    }


    public getList(userId: string, languageId: string): Observable<Text[]> {
        return this.db.texts.find$({userId, languageId});
    }


    public delete(textId): void {
        this.db.texts.remove$({_id: textId}).subscribe(() => {
            this.db.texts.persistence.compactDatafile();
        });
    }
}
