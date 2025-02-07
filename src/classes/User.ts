import { IUser } from './interfaces/IUser';
import { Company } from './Company';
import { Address } from './Address';

export class User implements IUser {
    Id: number = 0;
    Name: string = '';
    UserName: string = '';
    Email: string = '';
    Phone: string = '';
    WebSite: string = '';
    Company: Company | null = null;
    Address: Address | null = null;

    constructor();
    constructor(json: any);

    constructor(json?: any) {
        this.Name = json?.name;
        this.UserName = json?.username;
        this.Id = json?.id;
        this.Email = json?.email;
        this.Phone = json?.phone;
        this.WebSite = json?.website;
        this.Company = new Company(json?.company);
        this.Address = new Address(json?.address);
    }
}
