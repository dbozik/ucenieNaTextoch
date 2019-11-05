import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
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
                createdOn: (new Date()).getTime(),
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


    public getListFiltered(titleFragment?: string, textFragment?: string, createdFrom?: Date, createdTo?: Date): Observable<Text[]> {
        const searchObject: any = StateService.getInstance().userLanguageRequest;
        if (titleFragment) {
            searchObject.title = new RegExp(titleFragment);
        }
        if (textFragment) {
            searchObject.text = new RegExp(textFragment);
        }
        const createdOnSearch: any = {};
        if (createdFrom) {
            createdOnSearch.$gte = (new Date(createdFrom)).getTime();
        }
        if (createdTo) {
            createdOnSearch.$lte = (new Date(createdTo)).getTime();
        }
        if (Object.keys(createdOnSearch).length !== 0 || createdOnSearch.constructor !== Object) {
            searchObject.createdOn = createdOnSearch;
        }

        return this.db.texts.find$(searchObject);
    }


    public delete(textId): Observable<Text> {
        return this.db.texts.remove$({_id: textId}).pipe(
            tap(() => this.db.texts.persistence.compactDatafile())
        );
    }
}
