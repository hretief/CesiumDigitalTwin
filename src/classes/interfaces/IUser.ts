import { Company } from '../Company';

export interface IUser {
    Id: number;
    Name: string;
    UserName: string;
    Email: string;
    Phone: string;
    WebSite: string;
    Company: Company | null;
}
