import { ITwin } from './interfaces';

export class Twin implements ITwin {
    id: string = '';
    class: string = '';
    number: string = '';
    subClass: string = '';
    displayName: string = '';
    type: string = '';
    status: string = '';

    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.id = json?.id;
        this.class = json?.name;
        this.number = json?.username;
        this.subClass = json?.subClass;
        this.displayName = json?.displayName;
        this.type = json?.type;
        //this.status = json?status;
    }
}
