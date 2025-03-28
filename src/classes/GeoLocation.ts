import { IGeoLocation } from './interfaces';

export class GeoLocation implements IGeoLocation {
    Lat: string = '';
    Long: string = '';

    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.Lat = json?.lat;
        this.Long = json?.lng;
    }
}
