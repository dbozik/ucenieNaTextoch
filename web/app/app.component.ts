import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from './services/ipc.service';
import { ipcEvents } from '../shared/ipc-events.enum';
import { Routes } from '../shared/routes.enum';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [IpcService]
})
export class AppComponent {
    title = 'web';

    constructor(
        private readonly router: Router,
        private readonly ngZone: NgZone,
        private readonly ipcService: IpcService,
    ) {
        router.navigate([Routes.LOGIN]);        

        this.ipcService.ipc.on(ipcEvents.ROUTING, (event: any, url: string[]) => {            
            this.ngZone.run(() => this.router.navigate(url));
        });
    }
}
