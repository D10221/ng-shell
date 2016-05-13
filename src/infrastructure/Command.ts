export interface Command {
    execute(x: any);
    canExecute(x:any): boolean ;
}

export class RelayCommand  implements  Command {

    constructor(private exec: (x)=> void ,private canExec?: (x) => boolean ) {

        this.canExec = this.canExec || ((x)=> true );
    }

    execute(x:any) {
        this.exec(x);
    }

    canExecute(x:any): boolean {
        return this.canExec(x);
    }


}
