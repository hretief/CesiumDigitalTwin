import { Viewer as CesiumViewer, Cartesian3, Color, ITwinPlatform, ITwinData, SceneMode } from 'cesium';
import { Viewer, Scene, Entity, Cesium3DTileset, CameraFlyTo, CesiumComponentRef } from 'resium';
import { useEffect, useState, useRef } from 'react';
import { fetchGET } from '../../utils/fetchAPI';
import { CESIUM_TOKEN_URI, STATION_URI, STATION_IMODELID, OPENROADS_IMODELID, OPENROADS_TILESET_URI } from '../../utils/constants';
import CADModel from './CADModel';
import { ICADModel } from '../../classes/interfaces/ICADModel';
import data from '../../assets/imodels.json';
import { useAuth } from 'react-oidc-context';
import { PageTitle } from '../PageTitle';

const cadmodels: ICADModel[] = data;

export default function CesiumPage() {
    const auth = useAuth();

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    }

    const refViewer = useRef<CesiumComponentRef<CesiumViewer>>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                //const returnedData = await fetchGET(CESIUM_TOKEN_URI);
                //const { access_token: token } = await returnedData;
                ITwinPlatform.defaultAccessToken = token;
            } catch (e) {
                console.log(console.log(`Error reported from Components/CesiumPage Component: ${e}`));
            }
        };
        fetchToken();
    }, []);

    return (
        <>
            <Viewer full ref={refViewer}>
                <Scene mode={SceneMode.SCENE3D} morphDuration={10}>
                    {cadmodels.map((model) => (
                        <CADModel
                            imodelId={model.id}
                            token={ITwinPlatform.defaultAccessToken!}
                            position={Cartesian3.fromDegrees(model.lng, model.lat, model.height)}
                            name={model.name}
                            description={model.description}
                        ></CADModel>
                    ))}
                </Scene>
            </Viewer>
        </>
    );
}

/*
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getFacilitiesAsync, selectFacilityCount, selectFacilityPageNumber, selectFacilityStatus, selectFacilityFacilities } from "../Facilities/state/facilitiesSlice";
import { Facility } from "./Facility";
import { PageTitle } from "../PageTitle";
import { FacilityCard } from "./FacilityCard";
import { FacilityList} from "./FacilityList";

import { useAuth } from "react-oidc-context";

function FacilitiesPage() {
   const count = useAppSelector(selectFacilityCount);
   const pageNumber = useAppSelector(selectFacilityPageNumber);
   const status = useAppSelector(selectFacilityStatus);
   const dispatch = useAppDispatch();
   const location = useLocation();
   const auth = useAuth();
   const facilities: Facility[] = useAppSelector(selectFacilityFacilities);

   var token: string;
   if (auth.isAuthenticated) {
      token = auth.user?.access_token;
   }

   useEffect(() => {
      dispatch(getFacilitiesAsync(token));
   }, []);

   return (
      <div>
         <PageTitle title={location.pathname.replaceAll("/", " ").trimStart()} />
         <p>
            Status: {status}, Last count: {count}, PageNumber: {pageNumber}, Authenticated: {auth.isAuthenticated ? "True" : "False"}
         </p>
         <FacilityList facilities={facilities} />
      </div>
   );
}
export default FacilitiesPage;

*/
