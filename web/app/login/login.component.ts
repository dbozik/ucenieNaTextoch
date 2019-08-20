import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service';
import { ipcRenderer } from 'electron';
import { Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public ipcEvent$: Subject<any> = new ReplaySubject(1);

  public ipcEvent = this.ipcEvent$.toPromise();

  constructor(
  ) { 
    (window as any).component = this;
  }


  public signin(): void {
    this.ipcEvent$.next({hodnota: 'nieco'});
  }


  public signup(): void {

  }


  public forgottenPassword(): void {

  }

}
