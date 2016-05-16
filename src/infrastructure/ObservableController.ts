
import { EventArgs, IObservableController } from "./interfaces";

export class ObservableController implements  IObservableController {

    xEvents = new Rx.Subject<EventArgs>();

    constructor($scope: angular.IScope) {

        $scope.$on('$destroy', () => {
            console.log('Table Ctrl disposing');
            // watcherDispose();
            this.dispose();
        });
    }

    disposables = new Rx.CompositeDisposable();

    dispose(){
        this.disposables.dispose();
    }

    raiseEvent(key:string, value?: any){
        this.xEvents.onNext({
            sender: this,
            args: { key: key, value: value || true  }
        })
    }
}

