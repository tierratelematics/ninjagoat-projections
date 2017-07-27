import {
    ModelRetriever as ChupacabrasModelRetriever,
    INotificationManager,
    NotificationManager,
    IParametersDeserializer,
    IHttpClient
} from "chupacabras";
import ModelRetriever from "./model/ModelRetriever";
import IModelRetriever from "./model/IModelRetriever";
import {interfaces} from "inversify";
import {IModule} from "ninjagoat";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";
import * as io from "socket.io-client";
import ISocketConfig from "./ISocketConfig";
import {ParametersDeserializer} from "./ParametersDeserializer";

class ProjectionsModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IModelRetriever>("IModelRetriever").to(ModelRetriever).inSingletonScope();
        container.bind<IModelRetriever>("ModelRetriever").toDynamicValue(() => {
            let notificationManager = container.get<INotificationManager>("INotificationManager");
            let httpClient = container.get<IHttpClient>("IHttpClient");
            let parametersDeserializer: IParametersDeserializer;
            try {
                parametersDeserializer = container.get<IParametersDeserializer>("IParametersDeserializer");
            } catch (error) {
            }
            return new ChupacabrasModelRetriever(httpClient, notificationManager, parametersDeserializer);
        });
        container.bind<INotificationManager>("INotificationManager").toDynamicValue(() => {
            let socketClient = container.get<SocketIOClient.Socket>("SocketIOClient.Socket");
            return new NotificationManager(socketClient);
        });
        container.bind<SocketIOClient.Socket>("SocketIOClient.Socket").toDynamicValue(() => {
            let config = container.get<ISocketConfig>("ISocketConfig");
            return io.connect(config.endpoint, {
                path: config.path || "/socket.io",
                transports: config.transports || ["websocket"]
            });
        });
        container.bind<IParametersDeserializer>("IParametersDeserializer").to(ParametersDeserializer).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {

    }
}

export default ProjectionsModule
