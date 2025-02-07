import { useEffect, useState } from 'react';
import { User } from '../../classes/User';
import Button from '@mui/material/Button';
import { Box, TextField, FormControl } from '@mui/material';

interface UserProps {
    Id: number;
}

function UserView(props: UserProps) {
    const [user, setUser] = useState(new User());

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setUser((user) => ({
            ...user,
            [name]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(user);
        // Add form submission logic here
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`https://jsonplaceholder.typicode.com/users/${props.Id}`);
            const json: string = await data.json();

            let u: User = new User(json);
            setUser({ ...user, ...u });
        };
        fetchData();
    });

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl sx={{ width: '25ch' }}>
                    <TextField margin="normal" variant="filled" size="small" name="Name" label="Name" fullWidth value={user.Name} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="UserName" label="UserName" fullWidth value={user.UserName} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="Email" label="Email" fullWidth value={user.Email} onChange={handleChange} />
                    <TextField margin="normal" variant="filled" size="small" name="WebSite" label="Web Site" fullWidth value={user.WebSite} onChange={handleChange} />

                    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                        <TextField margin="normal" variant="filled" name="Name" label="Name" fullWidth value={user.Company?.Name} onChange={handleChange} />
                        <TextField margin="normal" variant="filled" name="Name" label="CatchPhrase" fullWidth value={user.Company?.CatchPhrase} onChange={handleChange} />
                        <TextField margin="normal" variant="filled" name="Name" label="Bs" fullWidth value={user.Company?.Bs} onChange={handleChange} />
                    </Box>
                </FormControl>
                <Button type="submit" variant="contained">
                    Submit
                </Button>
            </Box>
        </>
    );
}

export default UserView;
