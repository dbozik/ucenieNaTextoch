import { Injectable } from '@angular/core';
import { bindCallback, Observable } from 'rxjs';
import { User } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class LoginService {
    constructor(
        private readonly ipcService: IpcService,
    ) {
    }


    public login(user: User): Observable<User> {
        return this.ipcService.sendData(ipcEvents.LOGIN, user);
    }


    public loginFailed$(): Observable<any> {
        const loginFailed = bindCallback(callback => this.ipcService.ipc.on(ipcEvents.LOGIN_FAILED, callback));

        return loginFailed();
    }


    public signup(user: User): Observable<User> {
        return this.ipcService.sendData(ipcEvents.SIGNUP, user);
    }
}
