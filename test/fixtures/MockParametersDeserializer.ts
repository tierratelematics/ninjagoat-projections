import {IParametersDeserializer} from "../../scripts/model/ParametersDeserializer";
import {ViewModelContext} from "ninjagoat";

export default class MockParametersDeserializer implements IParametersDeserializer {
    deserialize(context: ViewModelContext): {} {
        return undefined;
    }

}