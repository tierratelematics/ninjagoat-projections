import {IParametersRefresher} from "./IModelRetriever";
import {Subject, Observable} from "rx";

class ParametersRefresher implements IParametersRefresher {

    private subject = new Subject<object>();

    refresh(parameters: Object) {
        this.subject.onNext(parameters);
    }

    updates(): Observable<object> {
        return this.subject;
    }

}

export default ParametersRefresher
