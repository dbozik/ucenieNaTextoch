import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { Routes } from '../../shared/routes.enum';
import { IpcService } from '../add-text/ipc.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public signinForm: FormGroup;

    public wrongCredentials: boolean = false;

    constructor(
        private readonly ipcService: IpcService,
        private readonly formBuilder: FormBuilder,
        private readonly cdr: ChangeDetectorRef,
        private readonly router: Router,
    ) {
    }


    public ngOnInit(): void {
        this.signinForm = this.formBuilder.group({
            username: this.formBuilder.control('', Validators.required),
            password: this.formBuilder.control('', Validators.required),
        });

        this.ipcService.ipc.on(ipcEvents.LOGIN_FAILED, () => {
            this.wrongCredentials = true;
            this.cdr.detectChanges();
        });
    }


    public signin(): void {
        if (this.signinForm.invalid) {
            this.wrongCredentials = true;
            return;
        }

        this.ipcService.ipc.send(ipcEvents.LOGIN, this.signinForm.value);
    }


    public onSignup(): void {
        this.router.navigateByUrl(Routes.SIGNUP);
    }


    public forgottenPassword(): void {

    }

}
