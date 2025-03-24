/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { LAYERS_URL } from '../../utils/constants';

const baseUrl = `${LAYERS_URL}`;
async function layersAPI(token: string | undefined, url: string) {
    try {
        console.log(`Fetching Layers Data from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });

        if (!response.ok) {
            throw new Error(`Unable to Fetch Layer Data, Please check URL or Network connectivity!!`);
        }
        const data = await response.json();
        return data.items;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}

export async function fetchLayers(token: string | undefined) {
    let url: string = `${baseUrl}`;
    return await layersAPI(token, url);
}
