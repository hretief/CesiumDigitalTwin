/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { ITWIN_URL } from '../../../utils/constants';

const baseUrl = `${ITWIN_URL}`;

async function itwinAPI(token: string, url: string) {
    try {
        console.log(`Fetching iTwin Data from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });

        if (!response.ok) {
            throw new Error(`Unable to Fetch iTwin Data, Please check URL or Network connectivity!!`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}

export async function fetchiTwins(token: string = '') {
    let url: string = `${baseUrl}`;
    return await itwinAPI(token, url);
}
