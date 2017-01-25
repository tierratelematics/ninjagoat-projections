import IModelRetriever from "./IModelRetriever";
import {injectable, inject, optional} from "inversify";
import * as Rx from "rx";
import {IHttpClient} from "ninjagoat";
import INotificationManager from "../notifications/INotificationManager";
import ModelState from "./ModelState";
import {ViewModelContext} from "ninjagoat";
import {IParametersDeserializer, NullParametersDeserializer} from "./ParametersDeserializer";
import {stringify} from "qs";

@injectable()
class ModelRetriever implements IModelRetriever {

    constructor(@inject("IHttpClient") private httpClient:IHttpClient,
                @inject("INotificationManager") private notificationManager:INotificationManager,
                @inject("IParametersDeserializer") @optional() private parametersDeserializer:IParametersDeserializer = new NullParametersDeserializer()) {

    }

    modelFor<T>(context:ViewModelContext):Rx.Observable<ModelState<T>> {
        let query = this.buildQueryForContext(context);
        return this.notificationManager.notificationsFor(context)
            .selectMany(notification => this.httpClient.get(notification.url + query))
            .map(response => ModelState.Ready(<T>response.response))
            .catch(error => Rx.Observable.just(ModelState.Failed(error)))
            .startWith(<ModelState<T>>ModelState.Loading());
    }

    private buildQueryForContext(context:ViewModelContext):string {
        let parameters = this.parametersDeserializer.deserialize(context);
        let query = "";
        if (parameters) {
            query += `?${stringify(parameters)}`;
        }
        return query;
    }
}

export default ModelRetriever