import {ViewModelContext} from "ninjagoat";
import ModelState from "./ModelState";
import {Observable} from "rx";

export interface IModelRetriever {
    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
}
