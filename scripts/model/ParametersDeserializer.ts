import {ViewModelContext} from "ninjagoat";

export interface IParametersDeserializer {
    deserialize(context: ViewModelContext): {};
}

export class NullParametersDeserializer implements IParametersDeserializer {

    deserialize(context: ViewModelContext): {} {
        return null;
    }

}