import { ILayer } from './interfaces';

export class Layer implements ILayer {
    id: number = 0;
    type: string = '';
    name: string = '';
    description: string = '';
    attribution: string = '';
    status: string = '';
    bytes: number = 0;
    dateAdded: string = '';
    exportable: string = '';
    percentComplete: number = 0;
    archivable: string = '';
    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.id = json?.id;
        this.type = json?.type;
        this.name = json?.name;
        this.description = json?.description;
        this.attribution = json?.attribution;
        this.status = json?.status;
        this.bytes = json?.bytes;
        this.dateAdded = json?.dateAdded;
        this.exportable = json?.exportable;
        this.percentComplete = json?.percentComplete;
        this.archivable = json?.archivable;
    }
}
