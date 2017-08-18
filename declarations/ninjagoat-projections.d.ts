import {ViewModelContext, Dictionary} from "ninjagoat";
import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {Observable} from "rx";
import {ModelRetrievera as CCModelRetriever} from "chupacabras";

export interface ISocketConfig {
    endpoint: string;
    path?: string;
    transports?: string[];
}

export class ModelState<T> {
    phase: ModelPhase;
    model: T;
    failure: any;

    static Loading<T>(): ModelState<T>;

    static Ready<T>(model: T): ModelState<T>;

    static Failed<T>(failure: any): ModelState<T>;
}

export enum ModelPhase {
    Loading,
    Ready,
    Failed
}

export interface IModelRetriever {
    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
}

export interface IParametersRefresher {
    refresh(parameters: object);
}

export class ModelRetriever implements IModelRetriever {
    constructor(modelRetriever: CCModelRetriever, refreshers: Dictionary<IParametersRefresher[]>);

    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
}

export class ProjectionsModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;
}

export interface IRefreshableModel {
    parametersRefresherReceived(service: IParametersRefresher);
}

export interface IParametersRefresherFactory {
    create(context: ViewModelContext, notificationKey: string): IParametersRefresher;
}
