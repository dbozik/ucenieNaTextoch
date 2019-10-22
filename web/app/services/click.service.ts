import { Observable, Subject } from 'rxjs';

export class ClickService {
    private wordClickedSource$: Subject<boolean> = new Subject<boolean>();

    public wordClicked$: Observable<boolean> = this.wordClickedSource$.asObservable();


    public click(): void {
        this.wordClickedSource$.next(true);
    }
}
