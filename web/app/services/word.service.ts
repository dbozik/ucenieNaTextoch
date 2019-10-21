import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WordObject } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class WordService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }


    public getWords(): Observable<WordObject[]> {
        return this.ipcService.getData(ipcEvents.GET_WORDS);
    }
}
