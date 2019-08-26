import { Component, OnInit } from '@angular/core';
import { IpcService } from '../add-text/ipc.service';
import { Language } from '../../../app/Objects/Language';
import { ipcEvents } from '../../shared/ipc-events.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private readonly ipcService: IpcService,
  ) { }

  public ngOnInit(): void {
    this.getLanguages();
  }


  /**
   * getLanguages
   */
  public getLanguages() {
    this.ipcService.getData<Language[]>(ipcEvents.LANGUAGES).subscribe(result => {
      console.table(result);
    });
  }

}
