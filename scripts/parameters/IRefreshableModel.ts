import {IParametersRefresher} from "./ParametersRefresher";

interface IRefreshableModel {
    parametersRefresherReceived(service: IParametersRefresher);
}

export default IRefreshableModel
