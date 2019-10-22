import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Language } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class LanguageService {
    private languageSelectedSource$: Subject<boolean> = new ReplaySubject(1);
    private languageChangedSource$: Subject<boolean> = new ReplaySubject(1);

    public languageSelected$: Observable<boolean> = this.languageSelectedSource$.asObservable();
    public languagesChanged$: Observable<boolean> = this.languageChangedSource$.asObservable();

    constructor(
        private readonly ipcService: IpcService,
    ) {
        this.ipcService.ipc.on(ipcEvents.LANGUAGE_SELECTED, () => this.languageSelectedSource$.next(true));
        this.ipcService.ipc.on(ipcEvents.LANGUAGES_CHANGED, () => this.languageChangedSource$.next(true));
    }


    public getLanguage(languageId: string): Observable<Language> {
        return this.ipcService.sendData(ipcEvents.GET_LANGUAGE, languageId);
    }


    public getLanguages(): Observable<Language[]> {
        return this.ipcService.getData<Language[]>(ipcEvents.LANGUAGES).pipe(
            map((languages: Language[]) => {
                return languages.sort((languageA, languageB) => {
                    if (languageA.name < languageB.name) {
                        return -1;
                    }
                    if (languageA.name > languageB.name) {
                        return 1;
                    }
                    return 0;
                });
            })
        );
    }


    public addLanguage(language: Language): Observable<Language> {
        return this.ipcService.sendData<Language>(ipcEvents.ADD_LANGUAGE, language);
    }


    public editLanguage(language: Language): Observable<Language> {
        return this.ipcService.sendData<Language>(ipcEvents.EDIT_LANGUAGE, language);
    }


    public deleteLanguage(languageId: string): Observable<void> {
        return this.ipcService.sendData<string, void>(ipcEvents.DELETE_LANGUAGE, languageId);
    }


    public selectLanguage(languageId: string): Observable<any> {
        return this.ipcService.sendData(ipcEvents.SELECT_LANGUAGE, languageId);
    }
}
