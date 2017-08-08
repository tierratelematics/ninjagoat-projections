import {IViewModelFactoryExtender, ViewModelContext} from "ninjagoat";
import {Observable} from "rx";
import {injectable} from "inversify";

@injectable()
class RefresherExtender implements IViewModelFactoryExtender {

    extend<T>(viewmodel: T, context: ViewModelContext, source: Observable<T>) {
        if ((<any>viewmodel).parametersRefresherReceived) {
            source.take(1).subscribe(refreshableModel => {
                (<any>viewmodel).parametersRefresherReceived(refreshableModel[1]);
            });
        }
    }

}

export default RefresherExtender
