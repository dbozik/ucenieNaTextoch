import * as path from 'path';
import {format, URL} from 'url';
import * as Datastore from 'nedb';

export class texts {
    public textId: number;

    constructor() { }

    addText(text: string, userId: number, languageId: number): void {
        var db = {};
        db.texts = new Datastore({
          filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
          autoload: true
        });
        db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text});
    }
}