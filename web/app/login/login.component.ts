import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Routes } from '../../shared/routes.enum';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService],
})
export class LoginComponent implements OnInit {
    public signinForm: FormGroup;

    public wrongCredentials: boolean = false;

    constructor(
        private readonly loginService: LoginService,
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

        this.loginService.loginFailed$().subscribe(() => {
            this.wrongCredentials = true;
            this.cdr.detectChanges();
        });
    }


    public signin(): void {
        if (this.signinForm.invalid) {
            this.wrongCredentials = true;
            return;
        }

        this.loginService.login(this.signinForm.value).subscribe();
    }


    public onSignup(): void {
        this.router.navigate([Routes.SIGNUP]);
    }


    public forgottenPassword(): void {

    }

}
