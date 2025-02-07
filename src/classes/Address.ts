import { IAddress } from './interfaces/IAddress';
import { GeoLocation } from './GeoLocation';

export class Address implements IAddress {
    Street: string = '';
    Suite: string = '';
    City: string = '';
    ZipCode: string = '';
    Geo: GeoLocation | null = null;

    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.Street = json?.street;
        this.Suite = json?.suite;
        this.City = json?.city;
        this.ZipCode = json?.zipcode;
        this.Geo = new GeoLocation(json?.geo);
    }
}
