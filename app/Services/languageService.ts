import { Observable } from 'rxjs';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA/namespace';
import Main from '../Main';
import { Language } from '../Objects/Language';
import * as Services from './namespace';

export class LanguageService {
    private languageDA = new DA.Languages();

    public constructor() {
    }

    public getList(userId: string): Observable<Language[]> {
        return this.languageDA.getList(userId);
    }

    public get(id: string): Observable<Language> {
        return this.languageDA.get(id);
    }

    public add(event, language: Language): void {
        const userId = Services.StateService.getInstance().userId;

        (new DA.Languages()).addLanguage(
            language.name,
            language.dictionary,
            userId,
            language.wordSeparators.toString(),
            language.sentenceSeparators.toString());
    }


    public edit(event, language: Language): void {
        (new DA.Languages()).editLanguage(
            language._id,
            language.name,
            language.dictionary,
            language.wordSeparators.toString(),
            language.sentenceSeparators.toString()
        );
    }


    public delete(event, languageId: string): void {
        (new DA.Languages()).delete(languageId);
    }


    public bindSendLanguages() {
        Main.bindSendData<Language[]>(ipcEvents.LANGUAGES, () => {
            const userId = Services.StateService.getInstance().userId;

            return this.getList(userId);
        });
    }
}
