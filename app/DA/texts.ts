import { Observable } from 'rxjs';
import { Text } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Texts {
    private db: Database = new Database();

    public constructor() {
    }

    public addText(text: string, title: string)
        : Observable<Text> {
        return this.db.texts.insert$(
            {
                ...StateService.getInstance().userLanguageRequest,
                createdOn: new Date(),
                text,
                title,
            });
    }


    public get(textId: string): Observable<Text> {
        return this.db.texts.findOne$({_id: textId});
    }


    public getList(): Observable<Text[]> {
        return this.db.texts.find$(StateService.getInstance().userLanguageRequest);
    }


    public delete(textId): void {
        this.db.texts.remove$({_id: textId}).subscribe(() => {
            this.db.texts.persistence.compactDatafile();
        });
    }
}
