import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Twin } from '../../classes/Twin';
import Button from '@mui/material/Button';
import { Box, TextField, FormControl } from '@mui/material';

import { fetchGET } from '../../utils/fetchAPI';
import { ITWIN_URL } from '../../utils/constants';

const baseUrl = `${ITWIN_URL}`;

interface TwinProps {
    Id: string;
}

function TwinView(props: TwinProps) {
    const auth = useAuth();

    var token: string | undefined;
    if (auth.isAuthenticated) {
        token = auth.user?.access_token;
    } else {
        auth.signinRedirect();
    }

    const [twin, setTwin] = useState(new Twin());

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setTwin((twin) => ({
            ...twin,
            [name]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(twin);
        // Add form submission logic here
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGET(`${baseUrl}/${props.Id}`, token);
            const json: string = await data.json();

            let u: Twin = new Twin(json);
            setTwin({ ...twin, ...u });
        };
        fetchData();
    });

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl sx={{ width: '25ch' }}>
                    <TextField margin="normal" variant="filled" size="small" name="Name" label="Name" fullWidth value={twin.displayName} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="TwinName" label="TwinName" fullWidth value={twin.class} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="Email" label="Email" fullWidth value={twin.subClass} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="WebSite" label="Web Site" fullWidth value={twin.type} onChange={handleChange} />
                </FormControl>
                <Button type="submit" variant="contained">
                    Submit
                </Button>
            </Box>
        </>
    );
}

export default TwinView;
