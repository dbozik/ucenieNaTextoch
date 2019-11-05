import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Text } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class TextsArchived {
    private db: Database = new Database();

    public constructor() {
    }


    public addText(text: Text)
        : Observable<Text> {
        return this.db.textsArchived.insert$(
            {
                ...StateService.getInstance().userLanguageRequest,
                _id: text._id,
                text: text.text,
                title: text.title,
                createdOn: text.createdOn,
            });
    }


    public get(textId: string): Observable<Text> {
        return this.db.textsArchived.findOne$({_id: textId});
    }


    public getList(): Observable<Text[]> {
        return this.db.textsArchived.find$(StateService.getInstance().userLanguageRequest);
    }


    public delete(textId: string): Observable<Text> {
        return this.db.textsArchived.remove$({_id: textId}).pipe(
            tap(() => this.db.textsArchived.persistence.compactDatafile()),
        );
    }
}
