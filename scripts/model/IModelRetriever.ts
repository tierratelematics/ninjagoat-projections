import {ViewModelContext, ObservableController} from "ninjagoat";
import ModelState from "./ModelState";

export interface IModelRetriever {
    controllerFor?<T>(context: ViewModelContext, notifyKeyProvider?: NotifyKeyProvider): ObservableController<ModelState<T>>;
}

export interface NotifyKeyProvider {
    (parameters: any): string;
}
