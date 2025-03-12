/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { REALITY_DATA_URL } from '../../../utils/constants';

const baseUrl = `${REALITY_DATA_URL}`;

async function realityDataAPI(token: string, url: string) {
    try {
        console.log(`Fetching Reality Data from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });

        if (!response.ok) {
            throw new Error(`Unable to Fetch Data, Please check URL or Network connectivity!!`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}

export async function fetchiTwinRealityDataReferences(token: string = '', iTwinId: string = '') {
    let url: string = `${baseUrl}/?iTwinId=${iTwinId}`;
    return await realityDataAPI(token, url);
}
