import { Observable } from 'rxjs';
import { Text } from '../Objects';
import { Database } from './database';

export class TextsArchived {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: Text)
        : Observable<Text> {
        return this.db.textsArchived.insert$(
            {
                userId: text.userId,
                languageId: text.languageId,
                text: text.text,
                title: text.title,
                createdOn: text.createdOn,
            });
    }

    public get(textId: string): Observable<Text> {
        return this.db.textsArchived.findOne$({_id: textId});
    }

    public getList(userId: string, languageId: string): Observable<Text[]> {
        return this.db.textsArchived.find$({userId, languageId});
    }
}
