import {IParametersDeserializer, ModelContext} from "chupacabras";
import {ViewModelContext, Dictionary} from "ninjagoat";
import {injectable, multiInject, optional} from "inversify";
import {map, zipObject} from "lodash";

export interface IModelParametersProvider {
    context: ViewModelContext;
    provide(contextParameters: object): object;
}

@injectable()
export class ParametersDeserializer implements IParametersDeserializer {

    private providers: Dictionary<IModelParametersProvider> = {};

    constructor(@multiInject("IModelParametersProvider") @optional() parametersProvider: IModelParametersProvider[] = []) {
        this.providers = zipObject<Dictionary<IModelParametersProvider>>(
            map(parametersProvider, provider => `${provider.context.area}:${provider.context.viewmodelId}`),
            parametersProvider);
    }

    deserialize(context: ModelContext): object {
        let provider = this.providers[`${context.area}:${context.modelId}`];
        return provider ? provider.provide(context.parameters) : null;
    }
}