import {ViewModelContext} from "ninjagoat";
import {IModule} from "ninjagoat";
import {interfaces} from "inversify";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {Observable} from "rx";

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
    refreshableModelFor<T>(context: ViewModelContext): Observable<RefreshableModelState<T>>;
}

export type RefreshableModelState<T> = [ModelState<T>, IParametersRefresher];

export interface IParametersRefresher {
    refresh(parameters: object);
}

export class ModelRetriever implements IModelRetriever {
    modelFor<T>(context: ViewModelContext): Observable<ModelState<T>>;
    refreshableModelFor<T>(context: ViewModelContext): Observable<RefreshableModelState<T>>;
}

export class ProjectionsModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;
}

export interface IRefreshableModel {
    parametersRefresherReceived(service: IParametersRefresher);
}
