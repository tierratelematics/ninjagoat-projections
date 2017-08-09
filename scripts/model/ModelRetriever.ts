import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import ModelState from "./ModelState";
import {ViewModelContext, IViewModelRegistry} from "ninjagoat";
import {IModelRetriever} from "./IModelRetriever";
import {IParametersRefresherFactory} from "../parameters/ParametersRefresherFactory";

@injectable()
class ModelRetriever implements IModelRetriever {

    constructor(@inject("ModelRetriever") private modelRetriever: ChupacabrasModelRetriever,
                @inject("IParametersRefresherFactory") private factory: IParametersRefresherFactory,
                @inject("IViewModelRegistry") private registry: IViewModelRegistry) {
    }

    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>> {
        let entry = this.registry.getEntry(context.area, context.viewmodelId),
            notifyKey = entry.viewmodel.notify ? entry.viewmodel.notify(context.parameters) : null,
            parametersRefresher = this.factory.create(context, notifyKey);
        return parametersRefresher.updates()
            .startWith(context.parameters)
            .map(parameters => {
                let chupacabrasContext = {
                        area: context.area,
                        modelId: context.viewmodelId,
                        parameters: parameters
                    },
                    chupacabrasNotifyKey = entry.viewmodel.notify ? entry.viewmodel.notify(parameters) : null;
                return this.modelRetriever.modelFor(chupacabrasContext, chupacabrasNotifyKey)
                    .map(response => ModelState.Ready(<T>response))
                    .catch(error => Observable.just(ModelState.Failed(error)))
                    .startWith(<ModelState<T>>ModelState.Loading());
            })
            .switch();
    }

}

export default ModelRetriever
