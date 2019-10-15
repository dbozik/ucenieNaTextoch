import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../Objects';
import { Database } from './database';

export class UserDA {
    private db: Database = new Database();

    public constructor() {
    }


    public addUser = (user: User): Observable<User> => {
        const userSource: ReplaySubject<User> = new ReplaySubject(1);

        const newUser: User = {
            createdOn: new Date(),
            name: user.username,
            password: user.password,
            email: user.email,
        };

        this.db.users.insert(newUser,
            (error, dbUser) => {
                userSource.next(dbUser);
                userSource.complete();
            });

        return userSource.asObservable();
    }


    public get(user: User): Observable<User> {
        const userSource$: ReplaySubject<User> = new ReplaySubject(null);

        this.db.users.findOne({name: user.username, password: user.password}, (error, response: User) => {
            userSource$.next(response);
            userSource$.complete();
        });

        return userSource$.asObservable();
    }
}
