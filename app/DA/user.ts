import * as path from 'path';
import { format, URL } from 'url';
import * as Datastore from 'nedb';
import { database } from './database';
import { ReplaySubject, Observable } from 'rxjs';
import { User } from '../Objects/User';

export class user {
    private db: database = new database();

    public constructor() { }

    public addUser(name: string, password: string, email: string)
        : Observable<User> {
        const userSource: ReplaySubject<User> = new ReplaySubject(1);

        const newUser: User = {
            createdOn: new Date(),
            name: name,
            password: password,
            email: password,
        };

        this.db.users.insert(newUser,
            (error, dbUser) => {
                userSource.next(dbUser);
                userSource.complete();
            });

        return userSource.asObservable();
    }

    public get(name, password): Observable<User> {
        const userSource$: ReplaySubject<User> = new ReplaySubject(null);

        this.db.texts.findOne({ name, password }, (error, user: User) => {
            userSource$.next(user);
            userSource$.complete();
        });

        return userSource$.asObservable();
    }
}