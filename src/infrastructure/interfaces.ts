export interface EventArgs {
    sender: {},
    args: KeyValue;
}

export interface KeyValue {
    key: string;
    value: any;
}

export interface IHaveEvents {
    pageEvents : Rx.Subject<EventArgs>;
    raiseNextEvent(key:string, value:any);
}

export interface IHaveBackingFields {
    backingFields: WeakMap<string,any>;
}