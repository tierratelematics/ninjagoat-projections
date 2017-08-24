import {ViewModelContext, Dictionary} from "ninjagoat";
import {IParametersRefresher, ParametersRefresher} from "./ParametersRefresher";
import {injectable} from "inversify";
import {ContextOperations} from "chupacabras";

export interface IParametersRefresherFactory {
    create(context: ViewModelContext, notificationKey: string): IParametersRefresher;
    get(context: ViewModelContext, notificationKey: string): IParametersRefresher;
}

@injectable()
export class ParametersRefresherFactory implements IParametersRefresherFactory {

    private cache: Dictionary<IParametersRefresher> = {};

    create(context: ViewModelContext, notificationKey: string): IParametersRefresher {
        let key = ContextOperations.keyFor(context, notificationKey);
        this.cache[key] = new ParametersRefresher();
        return this.cache[key];
    }

    get(context: ViewModelContext, notificationKey: string): IParametersRefresher {
        let key = ContextOperations.keyFor(context, notificationKey);
        return this.cache[key];
    }
}
