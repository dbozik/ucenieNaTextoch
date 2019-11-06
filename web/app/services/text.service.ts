import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Text, TextsSearch, Word } from '../../../app/Objects';
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


    public edit(text: Text): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.EDIT_TEXT, text);
    }


    public getParsed(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.GET_TEXT_PARSED, textId);
    }


    public getTexts(): Observable<Text[]> {
        return this.ipcService.getData(ipcEvents.GET_TEXTS);
    }


    public filterTexts(textFilter: TextsSearch): Observable<Text[]> {
        return this.ipcService.sendData(ipcEvents.FILTER_TEXTS, textFilter);
    }


    public openText(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.OPEN_TEXT, textId);
    }


    public openTextEdit(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.OPEN_TEXT_EDIT, textId);
    }


    public editWord(word: Word): Observable<Word> {
        return this.ipcService.sendData(ipcEvents.EDIT_WORD, word);
    }
}
