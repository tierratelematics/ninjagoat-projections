import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import {injectable, inject} from "inversify";
import {Observable} from "rx";
import ModelState from "./ModelState";
import {ViewModelContext, ObservableController} from "ninjagoat";
import {IModelRetriever, NotifyKeyProvider} from "./IModelRetriever";
import {merge} from "lodash";
import {ProjectionsController} from "./ProjectionsController";
import {ILogger, NullLogger, LoggingContext} from "ninjagoat";

@injectable()
@LoggingContext("ModelRetriever")
class ModelRetriever implements IModelRetriever {

    @inject("ILogger") private logger: ILogger = NullLogger;

    constructor(@inject("ModelRetriever") private modelRetriever: ChupacabrasModelRetriever) {
    }

    controllerFor<T>(context: ViewModelContext, notifyKeyProvider?: NotifyKeyProvider): ObservableController<ModelState<T>> {
        let emptyKeyProvider = () => null,
            provider = notifyKeyProvider || emptyKeyProvider,
            projectionsController = new ProjectionsController(),
            mergedParameters = {},
            logger = this.logger.createChildLogger(context.area).createChildLogger(context.viewmodelId);

        let source = projectionsController.updates()
            .startWith(context.parameters)
            .map(newParameters => {
                mergedParameters = merge({}, mergedParameters, newParameters);
                let chupacabrasContext = {
                        area: context.area,
                        modelId: context.viewmodelId,
                        parameters: mergedParameters
                    },
                    chupacabrasNotifyKey = provider(mergedParameters);

                logger.debug(`Loading new data with context ${JSON.stringify(chupacabrasContext)} and notify key ${chupacabrasNotifyKey}`);

                return this.modelRetriever.modelFor(chupacabrasContext, chupacabrasNotifyKey)
                    .map(response => ModelState.Ready(<T>response))
                    .catch(error => Observable.just(ModelState.Failed(error)))
                    .startWith(<ModelState<T>>ModelState.Loading());
            })
            .switch();

        return {
            model: source,
            refresh: projectionsController.refresh.bind(projectionsController)
        };
    }
}

export default ModelRetriever
