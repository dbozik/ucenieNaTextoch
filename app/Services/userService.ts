import { tap } from 'rxjs/operators';
import { ipcEvents } from '../../web/shared/ipc-events.enum';
import { Routes } from '../../web/shared/routes.enum';
import { Languages, UserDA } from '../DA';
import { IpcMainHandler, MethodHandler, RedirectHandler, SendRequestHandler } from '../Handlers';
import { LwtApp } from '../lwt-app';
import { Navigation } from '../navigation';
import { Language, User } from '../Objects';
import { StateService } from './stateService';

export class UserService {
    private userDA = new UserDA();

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
            new SendRequestHandler(() => (new Languages()).getList())
        ).next(
            new MethodHandler<any>((languages: Language[]) => {
                if (languages && languages.length > 0) {
                    languages = languages.sort((first, second) => first.name.localeCompare(second.name));
                    StateService.getInstance().language = languages[0];
                }
            })
        ).next(
            new MethodHandler<any>((languages: Language[]) => new Navigation().openMenu())
        ).next(
            new MethodHandler<any>(() => LwtApp.getInstance().mainWindow.webContents.send(ipcEvents.LOGGED_IN))
        ).next(
            new RedirectHandler(Routes.TEXTS)
        );

        signinChain.run({});
    }
}
