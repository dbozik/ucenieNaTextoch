import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Text } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from '../add-text/ipc.service';

@Injectable()
export class TextService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }

    public add(text: Text): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.ADD_TEXT, text);
    }


    public get(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.GET_TEXT, textId);
    }


    public getTexts(languageId: string): Observable<Text[]> {
        return this.ipcService.sendData(ipcEvents.GET_TEXTS, languageId);
    }


    public openText(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.OPEN_TEXT, textId);
    }
}
