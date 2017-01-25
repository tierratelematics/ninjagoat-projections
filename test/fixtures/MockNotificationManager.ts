import INotificationManager from "../../scripts/notifications/INotificationManager";
import Notification from "../../scripts/notifications/Notification";
import {Observable} from "rx";
import {ViewModelContext} from "ninjagoat";

export default class MockNotificationManager implements INotificationManager {

    notificationsFor(context: ViewModelContext): Observable<Notification> {
        return undefined;
    }

}
