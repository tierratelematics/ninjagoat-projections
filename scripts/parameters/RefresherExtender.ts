import {IViewModelFactoryExtender, ViewModelContext, Dictionary} from "ninjagoat";
import {Observable} from "rx";
import {inject, injectable} from "inversify";
import {IParametersRefresher} from "./ParametersRefresher";
import {last} from "lodash";

@injectable()
class RefresherExtender implements IViewModelFactoryExtender {

    constructor(@inject("RefreshersHolder") private refreshers: Dictionary<IParametersRefresher[]>) {

    }

    extend<T>(viewmodel: T, context: ViewModelContext, source: Observable<T>) {
        if ((<any>viewmodel).parametersRefresherReceived) {
            let refresherKey = `${context.area}:${context.viewmodelId}`;
            (<any>viewmodel).parametersRefresherReceived(last(this.refreshers[refresherKey]));
        }
    }

}

export default RefresherExtender
