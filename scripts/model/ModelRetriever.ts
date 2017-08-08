import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import ModelState from "./ModelState";
import {ViewModelContext} from "ninjagoat";
import {IModelRetriever, RefreshableModelState} from "./IModelRetriever";
import ParametersRefresher from "../parameters/ParametersRefresher";

@injectable()
class ModelRetriever implements IModelRetriever {

    constructor(@inject("ModelRetriever") private modelRetriever: ChupacabrasModelRetriever) {

    }

    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>> {
        return this.retrieveModel(context);
    }

    private retrieveModel<T>(context: ViewModelContext): Observable<ModelState<T>> {
        return this.modelRetriever.modelFor({
            area: context.area,
            modelId: context.viewmodelId,
            parameters: context.parameters
        })
            .map(response => ModelState.Ready(<T>response))
            .catch(error => Observable.just(ModelState.Failed(error)))
            .startWith(<ModelState<T>>ModelState.Loading());
    }

    refreshableModelFor<T>(context: ViewModelContext): Observable<RefreshableModelState<T>> {
        let parametersRefresher = new ParametersRefresher();
        return parametersRefresher.updates()
            .startWith(context.parameters)
            .flatMap(parameters => this.retrieveModel(new ViewModelContext(context.area, context.viewmodelId, parameters)))
            .map(modelState => [modelState, parametersRefresher]);
    }

}

export default ModelRetriever
