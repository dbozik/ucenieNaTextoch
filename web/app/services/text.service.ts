import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Text } from '../../../app/Objects/Text';
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
}
