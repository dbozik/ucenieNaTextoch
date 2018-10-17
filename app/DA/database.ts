import * as Datastore from 'nedb';
import * as path from 'path';

export class database {
    // private rootPath: string = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
    private rootPath = './data/';

    private _words: Datastore = null;
    private _texts: Datastore = null;
    private _languages: Datastore = null;
    private _settings: Datastore = null;
    private _users: Datastore = null;

    public get words(): Datastore {
        if (!this._words) {
            this._words = new Datastore({
                filename: path.join(this.rootPath, 'words.db'),
                autoload: true
            });
        }

        return this._words;
    }

    public get texts(): Datastore {
        if (!this._texts) {
            this._texts = new Datastore({
                filename: path.join(this.rootPath, 'texts.db'),
                autoload: true
            });
        }
        
        return this._texts;
    }

    public get languages(): Datastore {
        if (!this._languages) {
            this._languages = new Datastore({
                filename: path.join(this.rootPath, 'languages.db'),
                autoload: true
            });
        }
        
        return this._languages;
    }

    public get settings(): Datastore {
        if (!this._settings) {
            this._settings = new Datastore({
                filename: path.join(this.rootPath, 'settings.db'),
                autoload: true
            });
        }
        
        return this._settings;
    }

    public get users(): Datastore {
        if (!this._users) {
            this._users = new Datastore({
                filename: path.join(this.rootPath, 'users.db'),
                autoload: true
            });
        }
        
        return this._users;
    }
}