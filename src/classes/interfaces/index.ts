import { GeoLocation } from '../GeoLocation';
import { Company } from '../Company';
import { BoundingSphere } from 'cesium';

export interface IUser {
    Id: number;
    Name: string;
    UserName: string;
    Email: string;
    Phone: string;
    WebSite: string;
    Company: Company | null;
}

export interface IAddress {
    Street: string;
    Suite: string;
    City: string;
    ZipCode: string;
    Geo: GeoLocation | null;
}

export interface ICompany {
    Name: string;
    CatchPhrase: string;
    Bs: string;
}

// Interface for Attribute
export interface IAttrib {
    id: number;
    Name: string;
    Value: string;
}

// Interface for MUI Drawers
export interface IDrawerState {
    open: boolean;
}

// Interface for Model Elements
export interface IElement {
    element_id: any;
    imodel_id: string;
}

export interface IGeoLocation {
    Lat: string;
    Long: string;
}

// Interface for Reality Mesh
export interface IRealityMesh {
    id: string;
    displayName: string;
    type: string;
    itwinid: string;
}

// Interface for iTwins
export interface ITwin {
    id: string;
    class: string;
    subClass: string;
    displayName: string;
    number: string;
    type: string;
    status: string;
}

// Interface for iModels
export interface IBIMModel {
    itwinid: string;
    id: string;
    displayName: string;
    description: string;
    lat: number;
    lng: number;
    height: number;
}

export interface IModelBoundingSphere {
    imodelId: string;
    boundingSphere: BoundingSphere;
}

export interface ILayer {
    id: number;
    type: string;
    name: string;
    description: string;
    attribution: string;
    status: string;
    bytes: number;
    dateAdded: string;
    exportable: string;
    percentComplete: number;
    archivable: string;
}
