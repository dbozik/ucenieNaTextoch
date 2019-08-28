import { Injectable } from "@angular/core";
import { IpcRenderer } from "electron";
import { ipcEvents } from "../../shared/ipc-events.enum";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class IpcService {
    private _ipc: IpcRenderer;

    constructor() {
        if ((<any>window).require) {
            try {
                this._ipc = (<any>window).require('electron').ipcRenderer
            } catch (error) {
                throw error
            }
        } else {
            console.warn('Could not load electron ipc')
        }
    }

    public get ipc(): IpcRenderer {
        return this._ipc;
    }


    public getData<T>(event: ipcEvents): Observable<T> {
        const result: Subject<T> = new Subject();

        this._ipc.on(event + '-reply', (event, args) => {
            result.next(args);
            result.complete();
        });

        this._ipc.send(event);
        return result.asObservable();
    }
}