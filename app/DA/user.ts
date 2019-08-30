import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../Objects/User';
import { Database } from './database';

export class user {
    private db: Database = new Database();

    public constructor() {
    }

    public addUser(name: string, password: string, email: string)
        : Observable<User> {
        const userSource: ReplaySubject<User> = new ReplaySubject(1);

        const newUser: User = {
            createdOn: new Date(),
            name: name,
            password: password,
            email: email,
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

        this.db.users.findOne({name, password}, (error, response: User) => {
            userSource$.next(response);
            userSource$.complete();
        });

        return userSource$.asObservable();
    }
}
