import Notification from "./Notification";
import {ViewModelContext} from "ninjagoat";

interface INotificationManager {
    notificationsFor(context:ViewModelContext):Rx.Observable<Notification>;
}

export default INotificationManager