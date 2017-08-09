import {IViewModelFactoryExtender, ViewModelContext, IViewModelRegistry} from "ninjagoat";
import {Observable} from "rx";
import {inject, injectable} from "inversify";
import {IParametersRefresherFactory} from "./ParametersRefresherFactory";

@injectable()
class RefresherExtender implements IViewModelFactoryExtender {

    constructor(@inject("IParametersRefresherFactory") private factory: IParametersRefresherFactory,
                @inject("IViewModelRegistry") private registry: IViewModelRegistry) {

    }

    extend<T>(viewmodel: T, context: ViewModelContext, source: Observable<T>) {
        if ((<any>viewmodel).parametersRefresherReceived) {
            let entry = this.registry.getEntry(context.area, context.viewmodelId),
                notifyKey = entry.viewmodel.notify ? entry.viewmodel.notify(context.parameters) : null,
                parametersRefresher = this.factory.create(context, notifyKey);
            (<any>viewmodel).parametersRefresherReceived(parametersRefresher);
        }
    }

}

export default RefresherExtender
