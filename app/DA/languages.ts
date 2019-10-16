import { Observable } from 'rxjs';
import { Language } from '../Objects';
import { StateService } from '../Services';
import { Database } from './database';

export class Languages {
    private db: Database = new Database();

    public constructor() {
    }


    public addLanguage(name: string, dictionary: string, wordSeparators: string, sentenceSeparators: string)
        : Observable<Language> {
        return this.db.languages.insert$({
            userId: StateService.getInstance().userId,
            name,
            dictionary,
            wordSeparators,
            sentenceSeparators,
        });
    }


    public editLanguage(languageId: string, name: string, dictionary: string, wordSeparators: string,
                        sentenceSeparators: string)
        : Observable<Language> {
        return this.db.languages.update$(
            {
                _id: languageId,
            },
            {
                $set: {
                    name: name,
                    dictionary: dictionary,
                    wordSeparators: wordSeparators.toString(),
                    sentenceSeparators: sentenceSeparators.toString()
                },
            }
        );
    }


    public get(languageId: string): Observable<Language> {
        return this.db.languages.findOne$({_id: languageId});
    }


    public delete(languageId: string): Observable<any> {
        return this.db.languages.remove$({_id: languageId});
    }


    public getList(): Observable<Language[]> {
        return this.db.languages.find$({userId: StateService.getInstance().userId});
    }
}
