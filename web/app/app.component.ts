import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [LoginService]
})
export class AppComponent implements OnInit {
    title = 'lwt';
    public loggedIn: boolean = false;


    constructor(
        private readonly loginService: LoginService,
        private readonly router: Router,
        private readonly ngZone: NgZone,
        private readonly changeDetection: ChangeDetectorRef,
    ) {
        (window as any).router = router;
        (window as any).ngZone = ngZone;
    }


    public ngOnInit(): void {
        this.loginService.loggedIn$.subscribe((loggedIn: boolean) => {
            this.loggedIn = loggedIn;
            this.changeDetection.detectChanges();
        });
    }
}
