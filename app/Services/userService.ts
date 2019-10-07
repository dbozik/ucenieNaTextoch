import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA/namespace';
import { IpcMainHandler } from '../Handlers/ipc-main.handler';
import { RedirectHandler } from '../Handlers/redirect.handler';
import { SendRequestHandler } from '../Handlers/send-request.handler';
import { User } from '../Objects/User';
import { StateService } from './stateService';

export class UserService {
    private userDA = new DA.UserDA();

    public init(): void {
        this.signup();
    }

    /**
     * signin
     */
    public signin(name: string, password: string): Observable<boolean> {
        return this.userDA.get(name, password).pipe(
            tap((user: User) => {
                if (user) {
                    StateService.getInstance().userId = user._id;
                }
            }),
            map((user: User) => {
                return !!user;
            }),
        );
    }


    private signup(): void {
        const chain = new IpcMainHandler(ipcEvents.SIGNUP);

        const signupRequest$ = this.userDA.addUser;
        const sendRequestHandler = new SendRequestHandler(signupRequest$);
        chain.next = sendRequestHandler;

        sendRequestHandler.next = new RedirectHandler(Routes.LOGIN);

        chain.run({});
    }
}
