import { tap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import * as DA from '../DA';
import { IpcMainHandler } from '../Handlers/ipc-main.handler';
import { MethodHandler } from '../Handlers/method.handler';
import { RedirectHandler } from '../Handlers/redirect.handler';
import { SendRequestHandler } from '../Handlers/send-request.handler';
import { LwtApp } from '../lwt-app';
import { Navigation } from '../navigation';
import { User } from '../Objects/User';
import { StateService } from './stateService';

export class UserService {
    private userDA = new DA.UserDA();

    public init(): void {
        this.signup();
        this.signin();
    }


    private signup(): void {
        const signupRequest$ = this.userDA.addUser;

        const ipcMainHandler = new IpcMainHandler(ipcEvents.SIGNUP);
        const sendRequestHandler = new SendRequestHandler(signupRequest$);
        const redirectHandler = new RedirectHandler(Routes.LOGIN);

        ipcMainHandler.next = sendRequestHandler;
        sendRequestHandler.next = redirectHandler;

        ipcMainHandler.run({});
    }


    private signin(): void {
        const signinRequest$ = (user: User) => {
            return this.userDA.get(user).pipe(
                tap((userResponse: User) => {
                    if (userResponse) {
                        StateService.getInstance().userId = userResponse._id;
                    } else {
                        throw new Error('wrong credentials');
                    }
                }),
            );
        };

        const ipcMainHandler = new IpcMainHandler(ipcEvents.LOGIN);
        const sendRequestHandler = new SendRequestHandler(signinRequest$);
        const openMenuHandler = new MethodHandler<any>(() => (new Navigation().openMenu()));
        const redirectHandler = new RedirectHandler(Routes.TEXTS);
        const errorHandler = new MethodHandler<any>(() => LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.LOGIN_FAILED));

        ipcMainHandler.next = sendRequestHandler;
        sendRequestHandler.next = openMenuHandler;
        openMenuHandler.next = redirectHandler;
        sendRequestHandler.error = errorHandler;

        ipcMainHandler.run({});
    }
}
