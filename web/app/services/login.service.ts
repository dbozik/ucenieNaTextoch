import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class LoginService {
    private loggedInSource$: Subject<boolean> = new BehaviorSubject(false);

    public loggedIn$: Observable<boolean> = this.loggedInSource$.asObservable();


    public logIn(): void {
        this.loggedInSource$.next(true);
    }


    public logOut(): void {
        this.loggedInSource$.next(false);
    }
}
