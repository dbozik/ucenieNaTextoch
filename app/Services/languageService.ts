import { ipcMain } from 'electron';
import { Observable } from 'rxjs';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import * as DA from '../DA/namespace';
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


    public delete(event, languageId: string): void {
        (new DA.Languages()).delete(languageId);
    }


    public bindSendLanguages() {
        ipcMain.on(ipcEvents.LANGUAGES, (event, arg) => {
            const userId = Services.StateService.getInstance().userId;

            (new DA.Languages()).getList(userId).subscribe((response: Language[]) => {
                event.sender.send(ipcEvents.LANGUAGES + '-reply', response);
            });
        });
    }


    public bindAddLanguage(): void {
        ipcMain.on(ipcEvents.ADD_LANGUAGE, (event, arg: Language) => {
            const userId = Services.StateService.getInstance().userId;

            (new DA.Languages()).addLanguage(
                arg.name,
                arg.dictionary,
                userId,
                arg.wordSeparators.toString(),
                arg.sentenceSeparators.toString()).subscribe((response: Language) => {
                event.sender.send(ipcEvents.ADD_LANGUAGE + '-reply', response);
            });
        });
    }


    public bindEditLanguage() {
        ipcMain.on(ipcEvents.EDIT_LANGUAGE, (event, arg: Language) => {
            (new DA.Languages()).editLanguage(
                arg._id,
                arg.name,
                arg.dictionary,
                arg.wordSeparators.toString(),
                arg.sentenceSeparators.toString()
            ).subscribe((response: Language) => {
                event.sender.send(ipcEvents.EDIT_LANGUAGE + '-reply', response);
            });
        });
    }
}
