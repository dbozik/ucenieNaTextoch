import * as path from 'path';
import { Datastore } from './datastore';


export class Database {
    private rootPath = './data/';

    private _words: Datastore = null;

    public get words(): Datastore {
        this._words = new Datastore({
            filename: path.join(this.rootPath, 'words.db'),
            autoload: true
        });

        return this._words;
    }

    private _texts: Datastore = null;

    public get texts(): Datastore {
        this._texts = new Datastore({
            filename: path.join(this.rootPath, 'texts.db'),
            autoload: true
        });

        return this._texts;
    }

    private _textsArchived: Datastore = null;

    public get textsArchived(): Datastore {
        this._textsArchived = new Datastore({
            filename: path.join(this.rootPath, 'textsArchived.db'),
            autoload: true
        });

        return this._textsArchived;
    }

    private _languages: Datastore = null;

    public get languages(): Datastore {
        this._languages = new Datastore({
            filename: path.join(this.rootPath, 'languages.db'),
            autoload: true
        });

        return this._languages;
    }


    public destroyLanguages(): void {
        this._languages = null;
    }

    private _users: Datastore = null;

    public get users(): Datastore {
        this._users = new Datastore({
            filename: path.join(this.rootPath, 'users.db'),
            autoload: true
        });

        return this._users;
    }
}
