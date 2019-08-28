import { Injectable } from "@angular/core";
import { IpcService } from "../add-text/ipc.service";
import { Language } from "../../../app/Objects/Language";
import { ipcEvents } from "../../shared/ipc-events.enum";
import { Observable } from "rxjs";

@Injectable()
export class LanguageService {
    constructor(
        private readonly ipcService: IpcService,
    ) {}


    /**
     * getLanguages
     */
    public getLanguages(): Observable<Language[]> {
        return this.ipcService.getData<Language[]>(ipcEvents.LANGUAGES);
    }


    /**
     * addLanguage
     */
    public addLanguage(language: Language): void {
        this.ipcService.ipc.send(ipcEvents.ADD_LANGUAGE, language);
    }


    /**
     * editLanguage
     */
    public editLanguage(language: Language) {
        this.ipcService.ipc.send(ipcEvents.EDIT_LANGUAGE, language);
    }


    public deleteLanguage(languageId: string): void {
        this.ipcService.ipc.send(ipcEvents.DELETE_LANGUAGE, languageId);
    }
}