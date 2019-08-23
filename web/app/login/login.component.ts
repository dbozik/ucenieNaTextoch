import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IpcService } from '../add-text/ipc.service';
import { ipcEvents } from '../../shared/ipc-events.enum';

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
  ) {
  }


  public ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      username: this.formBuilder.control('', Validators.required),
      password: this.formBuilder.control('', Validators.required),
    });

    this.ipcService.ipc.on(ipcEvents.LOGIN_FAILED, () => this.wrongCredentials = true);
  }



  public signin(): void {
    if (this.signinForm.invalid) {
      this.wrongCredentials = true;
      return;
    }

    this.ipcService.ipc.send(ipcEvents.LOGIN, this.signinForm.value);
  }


  public onSignup(): void {

  }


  public forgottenPassword(): void {

  }

}
