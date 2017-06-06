import {IModelParametersProvider} from "../../scripts/ParametersDeserializer";
import {ViewModelContext} from "ninjagoat";

export class MockParametersProvider implements IModelParametersProvider {
    context = new ViewModelContext("Admin", "Profile");

    provide(contextParameters: object): Object {
        return {
            "test": (<any>contextParameters).id
        };
    }

}