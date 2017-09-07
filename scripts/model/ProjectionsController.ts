import {IModelController} from "ninjagoat";
import {Subject, Observable} from "rx";

export class ProjectionsController implements IModelController {

    private subject = new Subject<object>();

    refresh(parameters: Object) {
        this.subject.onNext(parameters);
    }

    updates(): Observable<object> {
        return this.subject;
    }

}
