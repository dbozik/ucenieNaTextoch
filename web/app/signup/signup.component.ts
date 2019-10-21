import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../app/Objects';
import { Routes } from '../../shared/routes.enum';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    public signupForm: FormGroup;

    public incorrectData: boolean = false;


    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly loginService: LoginService,
        private readonly changeDetector: ChangeDetectorRef,
        private readonly router: Router,
    ) {
    }


    public ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            username: this.formBuilder.control('', Validators.required),
            password: this.formBuilder.control('', Validators.required),
            repeatPassword: this.formBuilder.control('', Validators.required),
            email: this.formBuilder.control('', [Validators.required, Validators.email]),
        });

        this.signupForm.valueChanges.subscribe(() => this.incorrectData = false);
    }


    public onSignup(): void {
        if (this.signupForm.invalid) {
            return;
        }

        if (this.signupForm.get('password').value !== this.signupForm.get('repeatPassword').value) {
            this.incorrectData = true;
            return;
        }

        this.loginService.signup({
            username: this.signupForm.get('username').value,
            password: this.signupForm.get('password').value,
            email: this.signupForm.get('email').value,
        } as User).subscribe();
    }


    public onBack(): void {
        this.router.navigateByUrl(Routes.LOGIN);
    }

}
