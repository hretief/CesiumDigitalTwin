import { Divider, Menu, MenuItem } from "@mui/material";

import { Settings, Preferences, SignOut } from "../../Actions";
import { useAuth } from "react-oidc-context";

import { APP_URL } from "../../../utils/constants";

interface DefaultMenuProps {
   isMenuOpen: boolean;
   handleMenuClose: () => void;
   anchorEl: HTMLElement | null;
}




export const DefaultMenu = ({ isMenuOpen, handleMenuClose, anchorEl }: DefaultMenuProps) => {
   const auth = useAuth();

   const handleSignOutClick = () => {
      if (auth.isAuthenticated) auth.removeUser();
      window.location.href = APP_URL;
   };

      const handleSignInClick = () => {
         auth.signinRedirect();
      };

   return (
      <Menu anchorEl={anchorEl} id="primary-search-account-menu" keepMounted open={isMenuOpen} onClose={handleMenuClose}>
         <MenuItem onClick={handleMenuClose}>
            <Settings disableTooltip />
            Settings
         </MenuItem>
         <MenuItem onClick={handleMenuClose}>
            <Preferences disableTooltip />
            Preferences
         </MenuItem>
         <Divider />
         {auth.isAuthenticated ? (
            <MenuItem onClick={handleSignOutClick}>
               <SignOut disableTooltip />
               Sign Out
            </MenuItem>
         ) : (
            <MenuItem onClick={handleSignInClick}>
               <SignOut disableTooltip />
               Sign In
            </MenuItem>
         )}
      </Menu>
   );}
