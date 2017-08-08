import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import ModelState from "./ModelState";
import {ViewModelContext, Dictionary} from "ninjagoat";
import {IModelRetriever} from "./IModelRetriever";
import {IParametersRefresher, ParametersRefresher} from "../parameters/ParametersRefresher";
import {compact, concat} from "lodash";

@injectable()
class ModelRetriever implements IModelRetriever {

    constructor(@inject("ModelRetriever") private modelRetriever: ChupacabrasModelRetriever,
                @inject("RefreshersHolder") private refreshers: Dictionary<IParametersRefresher[]>) {
    }

    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>> {
        let parametersRefresher = new ParametersRefresher(),
            refresherKey = `${context.area}:${context.viewmodelId}`;
        // I'm using an array for refreshers to handle different models for the same context (e.g. dashboard)
        this.refreshers[refresherKey] = compact(concat(this.refreshers[refresherKey], parametersRefresher));
        return parametersRefresher.updates()
            .startWith(context.parameters)
            .map(parameters => {
                return this.modelRetriever.modelFor({
                    area: context.area,
                    modelId: context.viewmodelId,
                    parameters: parameters
                })
                    .map(response => ModelState.Ready(<T>response))
                    .catch(error => Observable.just(ModelState.Failed(error)))
                    .startWith(<ModelState<T>>ModelState.Loading())
            })
            .switch();
    }

}

export default ModelRetriever
