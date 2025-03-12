/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { USERS_URL } from '../../utils/constants';

const baseUrl = `${USERS_URL}`;

async function usersAPI(url: string) {
    try {
        console.log(`Fetching Users Data from: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Unable to Fetch Users Data, Please check URL or Network connectivity!!`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}

export async function fetchUsers() {
    let url: string = `${baseUrl}`;
    return await usersAPI(url);
}
