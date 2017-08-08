import {IParametersRefresher} from "../model/IModelRetriever";

interface IRefreshableModel {
    parametersRefresherReceived(service: IParametersRefresher);
}

export default IRefreshableModel
