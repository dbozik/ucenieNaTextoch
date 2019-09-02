import { Observable, ReplaySubject } from 'rxjs';
import { Language } from '../Objects/Language';
import { Database } from './database';

export class Languages {
    private db: Database = new Database();

    public constructor() {
    }

    private static retreive(dbLanguage: Language): Language {
        return {
            _id: dbLanguage._id,
            name: dbLanguage.name,
            dictionary: dbLanguage.dictionary,
            wordSeparators: new RegExp(dbLanguage.wordSeparators),
            sentenceSeparators: new RegExp(dbLanguage.sentenceSeparators),
            userId: dbLanguage.userId,
        };
    }

    public addLanguage(name: string, dictionary: string, userId: string, wordSeparators: string,
                       sentenceSeparators: string)
        : Observable<Language> {
        return this.observableRequest(callback => {
            this.db.languages.insert(
                {
                    userId: userId, name: name, dictionary: dictionary,
                    wordSeparators: wordSeparators.toString(),
                    sentenceSeparators: sentenceSeparators.toString()
                },
                (error, dbLanguage: any) => {
                    const language: Language = {
                        _id: dbLanguage._id,
                        name: dbLanguage.name,
                        dictionary: dbLanguage.dictionary,
                        wordSeparators: new RegExp(dbLanguage.wordSeparators),
                        sentenceSeparators: new RegExp(dbLanguage.sentenceSeparators),
                        userId: dbLanguage.userId,
                    };

                    callback(error, language);
                });
        });
    }


    public editLanguage(languageId: string, name: string, dictionary: string, wordSeparators: string,
                        sentenceSeparators: string)
        : Observable<Language> {
        return this.observableRequest(callback => {
            this.db.languages.update(
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
                },
                {},
                (error, dbLanguage: any) => {
                    const language: Language = Languages.retreive(dbLanguage);

                    callback(error, language);
                });
        });
    }


    public get(languageId: string): Observable<Language> {
        return this.observableRequest((callback) => {
            this.db.languages.findOne({_id: languageId}, callback);
        });
    }

    public delete(languageId: string): Observable<any> {
        return this.observableRequest((callback) => {
            this.db.languages.remove({_id: languageId}, callback);
        });
    }

    public getList(userId: string): Observable<Language[]> {
        return this.observableRequest((callback) => {
            this.db.languages.find({userId}, callback);
        });
    }

    private observableRequest(request: (callback) => void): Observable<any> {
        const responseSource$: ReplaySubject<any> = new ReplaySubject<any>(1);

        request((error, response) => {
            setTimeout(() => {
                responseSource$.next(response);
            }, 100);
        });

        this.db.languages.persistence.compactDatafile();

        return responseSource$.asObservable();
    }
}
