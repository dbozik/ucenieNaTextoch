import { Component, NgZone, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from './services/ipc.service';
import { ipcEvents } from '../shared/ipc-events.enum';
import { Routes } from '../shared/routes.enum';
import { LoginService } from './services/login.service';
import { Subject } from 'rxjs';

export const routingToken: InjectionToken<any> = new InjectionToken<any>('routing token');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        IpcService, 
        {
            provide: routingToken, 
            useFactory: () => new Subject<string[]>()
        }
    ]
})
export class AppComponent {
    title = 'web';

    constructor(
        private readonly router: Router,
        private readonly ngZone: NgZone,
        private readonly ipcService: IpcService,
        @Inject(routingToken) private readonly routing$: Subject<string[]>,
    ) {
        router.navigate([Routes.LOGIN]);
        this.routing$.next([Routes.LOGIN]);

        this.ipcService.ipc.on(ipcEvents.ROUTING, (event: any, url: string[]) => {
            this.routing$.next(url);
            
            this.ngZone.run(() => this.router.navigate(url));
        });
    }
}
