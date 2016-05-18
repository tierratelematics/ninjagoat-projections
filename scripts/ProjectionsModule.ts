import NotificationManager from "./notifications/NotificationManager";
import INotificationManager from "./notifications/INotificationManager";
import ModelRetriever from "./model/ModelRetriever";
import IModelRetriever from "./model/IModelRetriever";
import {IKernel, IKernelModule} from "inversify";
import {IModule} from "ninjagoat";
import {IViewModelRegistry} from "ninjagoat";
import {IServiceLocator} from "ninjagoat";

class ProjectionsModule implements IModule {

    modules:IKernelModule = (kernel:IKernel) => {
        kernel.bind<IModelRetriever>("IModelRetriever").to(ModelRetriever).inSingletonScope();
        kernel.bind<INotificationManager>("INotificationManager").to(NotificationManager).inSingletonScope();

    };

    register(registry:IViewModelRegistry, serviceLocator?:IServiceLocator, overrides?:any):void {

    }
}

export default ProjectionsModule;
