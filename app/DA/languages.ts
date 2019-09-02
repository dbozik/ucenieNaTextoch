import { Observable, ReplaySubject } from 'rxjs';
import { Language } from '../Objects/Language';
import { Database } from './database';

export class Languages {
    private db: Database = new Database();

    public constructor() {
    }

    public addLanguage(name: string, dictionary: string, userId: string, wordSeparators: string,
                       sentenceSeparators: string)
        : Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

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

                setTimeout(() => {
                    languageSource$.next(language);
                }, 100);
            });

        return languageSource$.asObservable();
    }


    public editLanguage(languageId: string, name: string, dictionary: string, wordSeparators: string,
                        sentenceSeparators: string)
        : Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

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
                const language: Language = this.retreive(dbLanguage);

                setTimeout(() => {
                    languageSource$.next(language);
                }, 100);
            });

        this.db.languages.persistence.compactDatafile();

        return languageSource$.asObservable();
    }


    public get(languageId: string): Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

        this.db.languages.findOne({_id: languageId}, (error, language: Language) => {
            languageSource$.next(language);
        });

        return languageSource$.asObservable();
    }


    public delete(languageId: string): Observable<any> {
        const responseSource$: ReplaySubject<any> = new ReplaySubject<any>(1);

        this.db.languages.remove({_id: languageId}, (error, response) => {
           setTimeout(() => {
               responseSource$.next(response);
           }, 100);
        });
        this.db.languages.persistence.compactDatafile();

        return responseSource$.asObservable();
    }


    public getList(userId: string): Observable<Language[]> {
        const languageSource$: ReplaySubject<Language[]> = new ReplaySubject(1);

        this.db.languages.find({userId}, (error, response: Language[]) => {
            languageSource$.next(response);
        });

        return languageSource$.asObservable();
    }


    private retreive(dbLanguage: Language): Language {
        return {
            _id: dbLanguage._id,
            name: dbLanguage.name,
            dictionary: dbLanguage.dictionary,
            wordSeparators: new RegExp(dbLanguage.wordSeparators),
            sentenceSeparators: new RegExp(dbLanguage.sentenceSeparators),
            userId: dbLanguage.userId,
        };
    }
}
