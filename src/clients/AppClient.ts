import { IAppContext } from '../contexts/AppContext';

import { User } from '../types/User';

class AppClient implements IAppContext {
    user: User;

    /**
     * Creates an instance of AppClient.
     * @memberof AppClient
     */
    constructor() {
        this.user = {
            id: '5e8d8hg8h8h8q8faf8g8f8f',
            name: 'Hilmar Retief',
            email: 'hilmar.retief@bentley.com',
            createdAt: new Date(),
            updatedAt: new Date(),
            isAdmin: true,
            isActive: true,
            isVerified: true,
        };
    }
}

export default AppClient;
