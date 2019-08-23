import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IpcService } from '../add-text/ipc.service';

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

  constructor(
    private readonly ipcService: IpcService,
  ) {
  }


  public ngOnInit(): void {
    
  }


  public signin(): void {
    this.ipcService.ipc.send('lwt-test');
  }


  public onSignup(): void {

  }


  public forgottenPassword(): void {

  }

}
