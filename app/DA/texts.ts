import * as path from 'path';
import {format, URL} from 'url';
import * as Datastore from 'nedb';

export class texts {
    public textId: number;

    public constructor() { }

    public addText(text: string, userId: number, languageId: number): void {
        const words = text.split(/[\s,.?!;:_()\[\]/\\"-]+/)
            .filter(word => word !== "");
        
        const parsedText: string[] = [];

        for (let index = 0; index < words.length - 1; index++) {
            parsedText.push(words[index]);
            const beginning = text.indexOf(words[index]) + words[index].length;
            const end = text.indexOf(words[index + 1]);
            const separator = text.substring(beginning, end);
            parsedText.push(separator);
        }
        
        console.dir(words);
        console.dir(parsedText);

        const db:  {texts: Datastore} = {texts: null};
        db.texts = new Datastore({
          filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
          autoload: true
        });
        // db.texts.insert({ id: 1, userId: userId, languageId: languageId, text: text});
    }
}