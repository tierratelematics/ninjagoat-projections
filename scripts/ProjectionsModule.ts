import NotificationManager from "./notifications/NotificationManager";
import INotificationManager from "./notifications/INotificationManager";
import ModelRetriever from "./model/ModelRetriever";
import IModelRetriever from "./model/IModelRetriever";
import {interfaces} from "inversify";
import {IModule} from "ninjagoat";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import * as io from "socket.io-client";
import ISocketConfig from "./ISocketConfig";

class ProjectionsModule implements IModule {

    modules = (container:interfaces.Container) => {
        container.bind<IModelRetriever>("IModelRetriever").to(ModelRetriever).inSingletonScope();
        container.bind<INotificationManager>("INotificationManager").to(NotificationManager).inSingletonScope();
        container.bind<SocketIOClient.Socket>("SocketIOClient.Socket").toDynamicValue(() => {
            let config = container.get<ISocketConfig>("ISocketConfig");
            return io.connect(config.endpoint, {path: config.path || "/socket.io", transports: ["websocket"]});
        });
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default ProjectionsModule;
