import {Subject, Observable} from "rx";

export interface IParametersRefresher {
    refresh(parameters: object);
    updates(): Observable<object>;
}

export class ParametersRefresher implements IParametersRefresher {

    private subject = new Subject<object>();

    refresh(parameters: Object) {
        this.subject.onNext(parameters);
    }

    updates(): Observable<object> {
        return this.subject;
    }

}
