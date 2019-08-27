import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '../add-text/ipc.service';
import { Language } from '../../../app/Objects/Language';
import { ipcEvents } from '../../shared/ipc-events.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public languages: Language[] = [];

  constructor(
    private readonly ipcService: IpcService,
    private readonly changeDetection: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.getLanguages();
  }


  /**
   * getLanguages
   */
  public getLanguages() {
    this.ipcService.getData<Language[]>(ipcEvents.LANGUAGES).subscribe((languages: Language[]) => {
      console.table(languages);
      this.languages = languages;
      this.changeDetection.detectChanges();
    });
  }

}
