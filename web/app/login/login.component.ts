import { Component, OnInit } from '@angular/core';
import { AppService } from '../app-service';
import { IpcRenderer, ipcMain } from 'electron';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private ipc: IpcRenderer

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer
      } catch (error) {
        throw error
      }

      this.ipc.send('lwt-test');
    } else {
      console.warn('Could not load electron ipc')
    }
  }


  public signin(): void {

  }


  public signup(): void {

  }


  public forgottenPassword(): void {

  }

}
