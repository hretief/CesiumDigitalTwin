//Cesium imports
import { IonResource } from 'cesium';
import { KmlDataSource, useCesium } from 'resium';

//React imports
import { useEffect, useState } from 'react';

//Redux imports

//Local imports
import {} from '../../Theme/state/themeSlice';

interface IKmlProps {
    ionId: number;
}

export default function IonKmlDatasource(props: IKmlProps) {
    const [kmldata, setKmldata] = useState<any>(null);

    useEffect(() => {
        const fetchKMLTiles = async () => {
            try {
                const resource = await IonResource.fromAssetId(props.ionId);
                setKmldata(resource);
            } catch (e) {
                alert(`Error reported while processing Google AQI Component: ${e}`);
            }
        };
        fetchKMLTiles();
    }, []);

    return (
        <>
            <KmlDataSource data={kmldata}></KmlDataSource>
        </>
    );
}
