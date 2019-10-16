import { Injectable } from '@angular/core';
import { BehaviorSubject, bindCallback, Observable, Subject } from 'rxjs';
import { User } from '../../../app/Objects';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { IpcService } from './ipc.service';

@Injectable()
export class LoginService {
    private loggedInSource$: Subject<boolean> = new BehaviorSubject<boolean>(false);

    public loggedIn$: Observable<boolean> = this.loggedInSource$.asObservable();

    constructor(
        private readonly ipcService: IpcService,
    ) {
        this.ipcService.ipc.on(ipcEvents.LOGGED_IN, () => this.loggedInSource$.next(true));
        this.ipcService.ipc.on(ipcEvents.LOGGED_OUT, () => this.loggedInSource$.next(false));
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
