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
  public editingId: string = null;

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


  /**
   * add
   */
  public add(): void {
    this.languages.push({
      _id: '0',
      name: '',
      dictionary: 'https://translate.google.com/?sl=de&tl=en#de/en/{word}',
      wordSeparators: new RegExp('/[.?!]+/'),
      sentenceSeparators: new RegExp('/[\s,.?!;:_()\[\]\/\\"-]+/'),
      userId: '',
    });

    this.editingId = '0';
  }


  /**
   * save
   */
  public save(languageId: string): void {
    
  }

}
