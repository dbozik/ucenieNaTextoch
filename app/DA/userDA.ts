import { Observable } from 'rxjs';
import { User } from '../Objects';
import { Database } from './database';

export class UserDA {
    private db: Database = new Database();

    public constructor() {
    }


    public addUser = (user: User): Observable<User> => {
        const newUser: User = {
            createdOn: new Date(),
            name: user.username,
            password: user.password,
            email: user.email,
        };

        return this.db.users.insert$(newUser);
    }


    public get(user: User): Observable<User> {
        return this.db.users.findOne$({name: user.username, password: user.password});
    }
}
