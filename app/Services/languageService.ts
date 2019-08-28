import * as DA from "../DA/namespace";
import { Observable, ReplaySubject } from "rxjs";
import { Language } from "../Objects/Language";
import { ipcEvents } from "../../web/shared/ipc-events.enum";
import Main from "../Main";
import * as Services from './namespace';

export class languageService {
    private languageDA = new DA.languages();

    public constructor() { }

    public getList(userId: string): Observable<Language[]> {
        return this.languageDA.getList(userId);
    }

    public get(id: string): Observable<Language> {
        return this.languageDA.get(id);
    }

    public add(event, language: Language): void {
        const userId = Services.StateService.getInstance().userId;

        (new DA.languages()).addLanguage(language.name, language.dictionary, userId, language.wordSeparators.toString(), language.sentenceSeparators.toString());
    }


    public edit(event, language: Language): void {
        (new DA.languages()).editLanguage(language._id, language.name, language.dictionary, language.wordSeparators.toString(), language.sentenceSeparators.toString());
    }
    

    public bindSendLanguages() {
        Main.bindSendData<Language[]>(ipcEvents.LANGUAGES, () => {
            const userId = Services.StateService.getInstance().userId;

            return this.getList(userId);
        });
    }
}
