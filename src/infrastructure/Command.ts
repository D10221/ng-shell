export interface Command {
    execute(x:any);
    canExecute(x:any):boolean ;
}

export class RelayCommand implements Command {

    constructor(private exec:(x)=> void, private canExec?:(x) => boolean) {

        this.canExec = this.canExec || ((x)=> true );
    }

    execute(x:any) {

        if (this.canExec(x)) {

            this.exec(x);
        }
    }

    canExecute(x:any):boolean {
        return this.canExec(x);
    }
}


export class RelayCommandExtended implements Command {

    constructor(private exec:(x)=>void, private canExec?:(x)=>boolean, private onError?:(e)=> void ) {

        this.canExec = this.canExec || ((x)=> true );
    }

    execute(x:any) {

        try {

            if (this.canExec(x)) {

                this.exec(x);
            }

        } catch (e) {

            if (this.onError) {
                this.onError(e);
                return;
            }

            throw e;
        }
    }

    canExecute(x:any):boolean {
        return this.canExec(x);
    }


    setCanExec(func:(x)=> boolean):RelayCommandExtended {
        this.canExecute = func;
        return this;
    }


    setonError(func:(e)=>void) : RelayCommandExtended {
        this.onError = func;
        return this;
    }
}