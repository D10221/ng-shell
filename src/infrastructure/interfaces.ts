export interface EventArgs {
    sender: {},
    args: KeyValue;
}

export interface KeyValue {
    key: string;
    value: any;
}

export interface IObservableThing {
    xEvents : Rx.Subject<EventArgs>;
}

export enum Visibility {
    visible, hidden
}

export enum SortDirection {
    desc, asc
}