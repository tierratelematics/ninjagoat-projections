import NotificationManager from "./notifications/NotificationManager";
import INotificationManager from "./notifications/INotificationManager";
import ModelRetriever from "./model/ModelRetriever";
import IModelRetriever from "./model/IModelRetriever";
import {IKernel, IKernelModule} from "inversify";
import {IModule} from "ninjagoat";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import * as io from "socket.io-client";
import ISocketConfig from "./ISocketConfig";

class ProjectionsModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        kernel.bind<IModelRetriever>("IModelRetriever").to(ModelRetriever).inSingletonScope();
        kernel.bind<INotificationManager>("INotificationManager").to(NotificationManager).inSingletonScope();
        kernel.bind<SocketIOClient.Socket>("SocketIOClient.Socket").toDynamicValue(() => {
            let config = kernel.get<ISocketConfig>("ISocketConfig");
            return io.connect(config.endpoint, {path: config.path || "/socket.io"});
        });
    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default ProjectionsModule;
