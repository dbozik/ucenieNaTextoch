import * as DA from "../DA/namespace";
import { Observable, ReplaySubject } from "rxjs";
import { Language } from "../Objects/Language";

export class languageService {
    private languageDA = new DA.languages();

    public constructor() { }

    public getList(): Observable<Language[]> {
        return this.languageDA.getList();
    }

    public get(id: string): Observable<Language> {
        return this.languageDA.get(id);
    }

    public add(name: string, dictionary: string, wordSeparators: RegExp,
        sentenceSeparators: RegExp, userId: string): void {
        this.languageDA.addLanguage(name, dictionary, userId, wordSeparators, sentenceSeparators);
    }
}
