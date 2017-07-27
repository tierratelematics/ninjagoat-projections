import {ViewModelContext} from "ninjagoat";
import ModelState from "./ModelState";
import {Observable} from "rx";

interface IModelRetriever {
    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
}

export default IModelRetriever
