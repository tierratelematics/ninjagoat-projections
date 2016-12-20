import Notification from "./Notification";
import {ViewModelContext} from "ninjagoat";
import {Observable} from "rx";

interface INotificationManager {
    notificationsFor(context: ViewModelContext): Observable<Notification>;
}

export default INotificationManager