import IRefreshableModel from "../../scripts/parameters/IRefreshableModel";
import {ObservableViewModel} from "ninjagoat";
import {IParametersRefresher} from "../../scripts/model/IModelRetriever";

export default class RefreshableViewModel extends ObservableViewModel<any> implements IRefreshableModel {

    protected onData(data: any): void {
    }

    parametersRefresherReceived(service: IParametersRefresher) {
    }

}
