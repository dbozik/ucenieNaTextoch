import * as DA from "../DA/namespace";
import { User } from "../Objects/User";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";

export class userService {
    private userDA = new DA.user();
    private userId: string;

    /**
     * signin
     */
    public signin(name: string, password: string): Observable<boolean> {
        return this.userDA.get(name, password).pipe(
            tap((user: User) => {
                if (user) {
                    this.userId = user.id;
                }
            }),
            map((user: User) => {
                return !!user;
            }),
        );
    }


    /**
     * signup
     */
    public signup(name: string, password: string, email: string): Observable<any> {
        return this.userDA.addUser(name, password, email);
    }
}