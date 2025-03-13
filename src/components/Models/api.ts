/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */

import { IMODEL_URL } from '../../utils/constants';
import { IBIMModel } from '../../classes/interfaces';

const baseUrl = `${IMODEL_URL}`;
async function modelsAPI(token: string | undefined, url: string) {
    try {
        console.log(`Fetching iModels Data from: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
        });

        if (!response.ok) {
            throw new Error(`Unable to Fetch iModel Data, Please check URL or Network connectivity!!`);
        }
        const data = await response.json();
        return data.iModels;
    } catch (error: any) {
        console.error('An Error Occured: ', error.message);
    }
}

export async function fetchiModelsByITwin(token: string | undefined, iTwinId: string) {
    let url: string = `${baseUrl}?iTwinId=${iTwinId}`;
    return await modelsAPI(token, url);
}

export async function fetchiModelsByScene(token: string | undefined, SceneiTwinIds: string): Promise<IBIMModel[]> {
    const iTwinArr: string[] = SceneiTwinIds.split(',');

    try {
        const allModels = await Promise.all(
            iTwinArr.map(async (id) => {
                const url = `${baseUrl}?iTwinId=${id}`;
                const iModelArr: IBIMModel[] = await modelsAPI(token, url);

                // Update the array with the iTwinId
                let i: number = 0;
                while (iModelArr[i]) {
                    iModelArr[i].itwinid = id;
                    i++;
                }

                return iModelArr;
            })
        );

        // Flatten the array of arrays
        return allModels.flat();
    } catch (error) {
        console.error('Error fetching iModels:', error);
        throw error;
    }
}

/*
    "iModels": [
        {
            "id": "2a570860-9c15-4cc8-a13e-55bf74ab069a",
            "displayName": "iTX_SYS_356cec8f-4506-40c6-b42e-4b9db6711866",
            "dataCenterLocation": "East US"
        },
        {
            "id": "02140ee1-3f9a-4869-ab91-03a3c03bd411",
            "displayName": "iTX_SYS_57076388-c5a9-4845-ba95-8689bbe45f46",
            "dataCenterLocation": "East US"
        },
        {
            "id": "06b1eb67-d8ba-4191-b062-16143ad40947",
            "displayName": "iTX_SYS_58bd0efd-a125-45eb-83d7-1abb30bc31a7",
            "dataCenterLocation": "East US"
        },
        {
            "id": "b3255bf6-e47f-45f6-aa94-e012ee1a638c",
            "displayName": "iTX_SYS_869f19e4-489f-4ef4-b09c-a80d9d83fb72",
            "dataCenterLocation": "East US"
        },
        {
            "id": "ae836e1e-66ab-4258-b8e5-4a58d2f2e1d0",
            "displayName": "iTX_SYS_95ed4348-b31b-4782-ac37-8296d6203b10",
            "dataCenterLocation": "East US"
        },
        {
            "id": "b95148fc-0af8-4aaf-9848-148c4d02eb49",
            "displayName": "iTX_SYS_fbe5109c-0e4e-40cf-b36f-b0c3bdc23b3a",
            "dataCenterLocation": "East US"
        }
    ],

*/
