import { ListItemButton, ListItemIcon, ListItemText, IconButton, styled } from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { useAuth } from 'react-oidc-context';
import { APP_URL } from '../../../../utils/constants';

export const SignOutRoute = () => {
    const auth = useAuth();

    const handleSignOutClick = () => {
        auth.removeUser();
        window.location.href = APP_URL;
    };

    return (
        <StyledListItemButton onClick={handleSignOutClick}>
            <ListItemIcon>
                <IconButton size="small">
                    <ExitToApp />
                </IconButton>
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
        </StyledListItemButton>
    );
};

const StyledListItemButton = styled(ListItemButton)`
    position: absolute;
    bottom: 0;
    width: 100%;
`;
