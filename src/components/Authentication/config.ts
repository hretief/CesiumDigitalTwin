/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

//import dotenv from "dotenv";
import { Config } from './models';
import { AUTH_AUTHORITY, AUTH_CLIENT_ID, AUTH_CLIENT_LOGOUT_URI, AUTH_CLIENT_SCOPES, AUTH_CLIENT_REDIRECT_URI } from '../../utils/constants';

export default class Configuration {
    private static config: Config;

    static read(): Config {
        if (!this.config) this.config = this.load();
        return this.config;
    }

    private static load(): Config {
        if (AUTH_AUTHORITY.length <= 0) throw new Error('Missing configuration value for OAUTH_AUTHORITY. Set it to https://ims.bentley.com');

        if (AUTH_CLIENT_ID.length <= 0 || AUTH_CLIENT_SCOPES.length <= 0)
            throw new Error('Missing configuration value for OAUTH_CLIENT_ID or IMJS_AUTH_CLIENT_SCOPES. You can create your application at https://developer.bentley.com/register/');

        return {
            Authority: AUTH_AUTHORITY,
            ClientId: AUTH_CLIENT_ID,
            Scopes: AUTH_CLIENT_SCOPES,
            RedirectUri: AUTH_CLIENT_REDIRECT_URI,
            LogoutUri: AUTH_CLIENT_LOGOUT_URI,
        };
    }
}
