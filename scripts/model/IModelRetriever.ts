import {ViewModelContext} from "ninjagoat";
import ModelState from "./ModelState";
import {Observable} from "rx";

export interface IModelRetriever {
    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
    refreshableModelFor<T>(context: ViewModelContext): Observable<RefreshableModelState<T>>;
}

export type RefreshableModelState<T> = [ModelState<T>, IParametersRefresher];

export interface IParametersRefresher {
    refresh(parameters: object);
}
