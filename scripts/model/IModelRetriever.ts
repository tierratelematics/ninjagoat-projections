import {ViewModelContext, ObservableController} from "ninjagoat";
import ModelState from "./ModelState";
import {Observable} from "rx";

export interface IModelRetriever {
    modelFor<T>(context: ViewModelContext, notifyKeyProvider?: NotifyKeyProvider): Observable<ModelState<T>>;
    controllerFor<T>(context: ViewModelContext, notifyKeyProvider?: NotifyKeyProvider): ObservableController<ModelState<T>>;
}

export interface NotifyKeyProvider {
    (parameters: any): string;
}
