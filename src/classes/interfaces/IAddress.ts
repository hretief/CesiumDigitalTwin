import { GeoLocation } from '../GeoLocation';

export interface IAddress {
    Street: string;
    Suite: string;
    City: string;
    ZipCode: string;
    Geo: GeoLocation | null;
}
