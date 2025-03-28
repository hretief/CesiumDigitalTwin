/*
 * Copyright © Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 */
import { IMODEL_URL, ION_TOKEN } from '../utils/constants';
import { IBIMModel, IRealityMesh, ITwin } from '../classes/interfaces';
import { ITwinData, ITwinPlatform, Ion } from 'cesium';
import { fetchRealityMesh3DTiles } from '../components/Viewer/RealityMesh/api';

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

export async function fetchiModelsTilesets(token: string | undefined, iModelArr: IBIMModel[]): Promise<IBIMModel[]> {
    Ion.defaultAccessToken = ION_TOKEN || '';
    try {
        ITwinPlatform.defaultAccessToken = token;
        const allModels = await Promise.all(
            iModelArr.map(async (model) => {
                if (!model.tilesUrl) {
                    const mytiles = await ITwinData.createTilesetFromIModelId(model.id);
                    model.tilesUrl = mytiles?.resource.url;
                }
                return model; // Return only the updated model
            })
        );

        return allModels; // No need to flatten as `map` already returns a flat array
    } catch (error) {
        console.error('Error fetching iModel Tiles:', error);
        throw error;
    }
}

export async function fetchRealityMeshTilesets(token: string | undefined, MeshArr: IRealityMesh[]): Promise<IRealityMesh[]> {
    Ion.defaultAccessToken = ION_TOKEN || '';
    try {
        ITwinPlatform.defaultAccessToken = token;
        const allMeshes = await Promise.all(
            MeshArr.map(async (mesh) => {
                if (!mesh.tilesUrl) {
                    const mytiles = await ITwinData.createTilesetForRealityDataId(mesh.itwinid, mesh.id);
                    mesh.tilesUrl = mytiles?.resource.url;
                }
                return mesh; // Return only the updated model
            })
        );

        // Flatten the array of arrays
        return allMeshes;
    } catch (error) {
        console.error('Error fetching iModel Tiles:', error);
        throw error;
    }
}

// Find al the reality meshes for the iTwin
async function fetchRealityDataReferences(token: string | undefined, iTwinId: string) {
    const returnedData = await fetchRealityMesh3DTiles(token, iTwinId);
    const json = await returnedData.realityData;
    return (json as IRealityMesh[]).filter((x) => x.type === 'RealityMesh3DTiles');
}

export async function fetchAllRealityDataReferences(token: string | undefined, cadmodels: IBIMModel[]) {
    let meshes: IRealityMesh[] = [];
    for (const model of cadmodels) {
        let itwinMeshes: IRealityMesh[] = await fetchRealityDataReferences(token, model.itwinid);
        let i: number = 0;
        while (itwinMeshes[i]) {
            itwinMeshes[i].itwinid = model.itwinid;
            itwinMeshes[i].heightcorrection = model.heightcorrection;
            i++;
        }

        meshes.push(...itwinMeshes);
    }
    return meshes;
}
