import {ViewModelContext} from "ninjagoat";

class ContextOperations {
    static keyFor(context: ViewModelContext, notificationKey?: string): string {
        let channel = `/${context.area}/${context.viewmodelId}`.toLowerCase();
        if (notificationKey)
            channel += `/${notificationKey}`;
        return channel;
    }
}

export default ContextOperations
