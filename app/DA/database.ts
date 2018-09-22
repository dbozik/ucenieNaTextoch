import * as Datastore from 'nedb';
import * as path from 'path';

export class database {
    private _words: Datastore = null;
    private _texts: Datastore = null;

    public get words(): Datastore {
        if (!this._words) {
            this._words = new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'words.db'),
                autoload: true
            });
        }

        return this._words;
    }

    public get texts(): Datastore {
        if (!this._texts) {
            this._texts = new Datastore({
                filename: path.join(process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local'), 'texts.db'),
                autoload: true
            });
        }
        
        return this._texts;
    }
}