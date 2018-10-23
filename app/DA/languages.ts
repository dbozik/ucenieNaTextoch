import * as path from 'path';
import { format, URL } from 'url';
import * as Datastore from 'nedb';
import { database } from './database';
import { ReplaySubject, Observable } from 'rxjs';
import { TextObject } from '../Objects/TextObject';
import { Language } from '../Objects/Language';

export class languages {
    private db: database = new database();

    public constructor() { }

    public addLanguage(name: string, dictionary: string, userId: string, wordSeparators: RegExp,
        sentenceSeparators: RegExp)
        : Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);
        const pokus = 6;

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

                languageSource$.next(dbLanguage);
            });

        return languageSource$.asObservable();
    }

    public get(languageId: string): Observable<Language> {
        const languageSource$: ReplaySubject<Language> = new ReplaySubject(1);

        this.db.languages.findOne({ _id: languageId }, (error, language: Language) => {
            languageSource$.next(language);
        });

        return languageSource$.asObservable();
    }

    public getList(): Observable<Language[]> {
        const languageSource$: ReplaySubject<Language[]> = new ReplaySubject(1);

        this.db.languages.find({}, (error, languages: Language[]) => {
            languageSource$.next(languages);
        });

        return languageSource$.asObservable();
    }
}