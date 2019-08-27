import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IpcService } from '../add-text/ipc.service';
import { Language } from '../../../app/Objects/Language';
import { ipcEvents } from '../../shared/ipc-events.enum';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public languages: Language[] = [];
  public editingId: string = null;

  public languageForm: FormGroup;

  private NEW_LANGUAGE_ID: string = '001';

  constructor(
    private readonly formBuilder: FormBuilder,
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
    const newLanguage: Language = {
      _id: this.NEW_LANGUAGE_ID,
      name: '',
      dictionary: 'https://translate.google.com/?sl=de&tl=en#de/en/{word}',
      wordSeparators: new RegExp('/[.?!]+/'),
      sentenceSeparators: new RegExp('/[\s,.?!;:_()\[\]\/\\"-]+/'),
      userId: '',
    };

    this.languages.push(newLanguage);

    this.setupForm(newLanguage);

    this.editingId = this.NEW_LANGUAGE_ID;
  }


  /**
   * edit
   */
  public edit(languageId: string): void {
    const editingLanguage: Language = this.languages.find((language: Language) => language._id === languageId);

    this.setupForm(editingLanguage);
    this.editingId = languageId;
    this.changeDetection.detectChanges();
  }


  /**
   * save
   */
  public save(languageId: string): void {
    
  }


  /**
   * remove
   */
  public remove(languageId: string) {
    
  }


  /**
   * cancel
   */
  public cancel() {
    this.editingId = null;
    this.languages = this.languages.filter((language: Language) => language._id !== this.NEW_LANGUAGE_ID);
    this.changeDetection.detectChanges();
  }


  private setupForm(language: Language): void {
    this.languageForm = this.formBuilder.group({
      name: language.name,
      dictionary: language.dictionary,
      wordSeparators: language.wordSeparators,
      sentenceSeparators: language.sentenceSeparators,
    });
  }

}
