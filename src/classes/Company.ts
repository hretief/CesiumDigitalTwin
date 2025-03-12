import { ICompany } from './interfaces';

export class Company implements ICompany {
    Name: string = '';
    CatchPhrase: string = '';
    Bs: string = '';

    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.Name = json?.name;
        this.CatchPhrase = json?.catchPhrase;
        this.Bs = json?.bs;
    }
}
