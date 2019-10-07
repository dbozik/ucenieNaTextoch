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

        const signupChain = new IpcMainHandler(ipcEvents.SIGNUP);
        signupChain
            .next(
                new SendRequestHandler(signupRequest$)
            )
            .next(
                new RedirectHandler(Routes.LOGIN)
            );

        signupChain.run({});

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

        const sendRequest = new SendRequestHandler(signinRequest$);
        sendRequest.error(
            new MethodHandler<any>(() => LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.LOGIN_FAILED))
        );

        const signinChain = new IpcMainHandler(ipcEvents.LOGIN);

        signinChain.next(
            sendRequest
        ).next(
            new MethodHandler<any>(() => (new Navigation().openMenu()))
        ).next(
            new RedirectHandler(Routes.TEXTS)
        );

        signinChain.run({});
    }
}
