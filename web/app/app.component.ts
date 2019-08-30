import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'web';

    constructor(
        private readonly router: Router,
        private readonly ngZone: NgZone,
    ) {
        (window as any).router = router;
        (window as any).ngZone = ngZone;
    }
}
