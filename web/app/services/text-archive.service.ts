import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Text } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class TextArchiveService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }


    public getList(): Observable<Text[]> {
        return this.ipcService.getData(ipcEvents.GET_ARCHIVED_TEXTS);
    }


    public archiveText(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.ARCHIVE_TEXT, textId);
    }


    public unarchiveText(textId: string): Observable<Text> {
        return this.ipcService.sendData(ipcEvents.UNARCHIVE_TEXT, textId);
    }
}
