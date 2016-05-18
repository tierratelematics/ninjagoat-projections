import {ViewModelContext} from "ninjagoat";
import ModelState from "./ModelState";

interface IModelRetriever {
    modelFor<T>(context:ViewModelContext):Rx.Observable<ModelState<T>>;
}

export default IModelRetriever