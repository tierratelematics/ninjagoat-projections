import NotificationManager from "./notifications/NotificationManager";
import INotificationManager from "./notifications/INotificationManager";
import ModelRetriever from "./model/ModelRetriever";
import IModelRetriever from "./model/IModelRetriever";
import {IKernel, IKernelModule} from "inversify";
import {IModule} from "ninjagoat";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import {IEndpointConfig} from "ninjagoat";
import {Config_WebSocket} from "./RegistrationKeys";
import * as io from "socket.io-client";

class ProjectionsModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        kernel.bind<IModelRetriever>("IModelRetriever").to(ModelRetriever).inSingletonScope();
        kernel.bind<INotificationManager>("INotificationManager").to(NotificationManager).inSingletonScope();
        kernel.bind<SocketIOClient.Socket>("SocketIOClient.Socket").toDynamicValue(() => {
            let config = kernel.getNamed<IEndpointConfig>("IEndpointConfig", Config_WebSocket);
            return io.connect(config.endpoint);
        });

    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default ProjectionsModule;
