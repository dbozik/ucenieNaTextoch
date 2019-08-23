import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IpcService } from '../add-text/ipc.service';
import * as Services from '../../../app/Services/namespace';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public signinForm: FormGroup;

  @Output()
  public login: EventEmitter<void> = new EventEmitter();
  @Output()
  public signup: EventEmitter<void> = new EventEmitter();  

  @Input()
  public wrongCredentials: boolean = false;

  constructor(
    private readonly ipcService: IpcService,
    private readonly formBuilder: FormBuilder,
  ) {
  }


  public ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
    });

    this.signinForm.valueChanges.subscribe(() => this.wrongCredentials = false);
  }



  public signin(): void {
    if (this.signinForm.invalid) {
      return;
    }

    const userService = new Services.userService();

    userService.signin(this.signinForm.get('name').value, this.signinForm.get('password').value).subscribe((success: boolean) => {
        if (success) {
            this.ipcService.ipc.send('lwt-login');
        } else {
            this.wrongCredentials = true;
        }
    }, (error) => console.dir(error));
  }


  public onSignup(): void {

  }


  public forgottenPassword(): void {

  }

}
