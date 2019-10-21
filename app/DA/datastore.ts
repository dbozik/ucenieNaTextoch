import * as DatastoreNedb from 'nedb';
import { bindCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class Datastore extends DatastoreNedb {
    constructor(args: any) {
        super(args);
    }


    public find$(query: any): Observable<any> {
        return bindCallback<any>(callback =>
            this.find(query, callback)
        )().pipe(
            map(data => {
                if (data[0]) {
                    throw data[0];
                } else {
                    return data[1];
                }
            })
        );
    }


    public findOne$(query: any): Observable<any> {
        return bindCallback<any>(callback =>
            this.findOne(query, callback)
        )().pipe(
            map(data => {
                if (data[0]) {
                    throw data[0];
                } else {
                    return data[1];
                }
            })
        );
    }


    public insert$(newDoc: any): Observable<any> {
        return bindCallback<any>((callback) =>
            this.insert(newDoc, callback)
        )().pipe(
            map(data => {
                if (data[0]) {
                    throw data[0];
                } else {
                    return data[1];
                }
            })
        );
    }


    public update$(query, updatedQuery): Observable<any> {
        return bindCallback<any>((callback) =>
            this.update(query, updatedQuery, {}, callback)
        )().pipe(
            map(data => {
                if (data[0]) {
                    throw data[0];
                } else {
                    return data[1];
                }
            })
        );
    }


    public remove$(query: any): Observable<any> {
        return bindCallback<any>(callback =>
            this.remove(query, callback)
        )().pipe(
            map(data => {
                if (data[0]) {
                    throw data[0];
                } else {
                    return data[1];
                }
            })
        );
    }
}
