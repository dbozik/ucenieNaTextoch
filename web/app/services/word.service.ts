import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Word, WordsSearch } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class WordService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }


    public getWords(filter: WordsSearch): Observable<Word[]> {
        return this.ipcService.sendData(ipcEvents.GET_WORDS, filter);
    }


    public getWord(wordId: string): Observable<Word> {
        return this.ipcService.sendData(ipcEvents.GET_WORD, wordId);
    }


    public openWord(wordId: string): Observable<string> {
        return this.ipcService.sendData(ipcEvents.OPEN_WORD_EDIT, wordId);
    }


    public editWord(word: Word): Observable<Word> {
        return this.ipcService.sendData(ipcEvents.EDIT_WORD, word);
    }


    public saveSelection(word: Word): Observable<Word> {
        return this.ipcService.sendData(ipcEvents.SAVE_SELECTION, word);
    }
}
