import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Text, TextPart } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

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


    public getParsed(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.GET_TEXT_PARSED, textId);
    }


    public getTexts(languageId: string): Observable<Text[]> {
        return this.ipcService.sendData(ipcEvents.GET_TEXTS, languageId);
    }


    public openText(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.OPEN_TEXT, textId);
    }


    public editWord(word: TextPart): Observable<TextPart> {
        return this.ipcService.sendData(ipcEvents.EDIT_WORD, word);
    }
}
