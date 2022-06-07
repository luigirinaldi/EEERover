import React from "react";
import { Nav, NavLink } from "./NavbarElements";
  
const Navbar = () => {
  return (
      <Nav>
        <NavLink to="/" activeStyle>
         <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M1.84448 11V5.50661C1.84448 3.484 3.48413 1.84436 5.50673 1.84436H16.4935C18.5161 1.84436 20.1557 3.484 20.1557 5.5066V11C20.1557 13.0226 18.5161 14.6622 16.4935 14.6622H5.50673C3.48413 14.6622 1.84448 13.0226 1.84448 11Z" stroke="white" stroke-width="1.7"/>
         <path d="M5.03955 18.3245H16.9602" stroke="#DF1463" stroke-width="1.7" stroke-linecap="round"/>
         </svg>
        </NavLink>
        <NavLink to="/Debug" activeStyle>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M3.81372 11.1254V20.1922C3.81372 20.721 4.2424 21.1497 4.7712 21.1497H9.5586V11.1254C9.5586 10.5966 9.12992 10.1679 8.60112 10.1679H4.7712C4.2424 10.1679 3.81372 10.5966 3.81372 11.1254Z" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
         <path d="M20.0909 12.832H16.2609C15.7321 12.832 15.3035 13.2607 15.3035 13.7895V21.1529H20.0909C20.6197 21.1529 21.0483 20.7242 21.0483 20.1954V13.7895C21.0483 13.2607 20.6197 12.832 20.0909 12.832Z" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
         <path d="M9.55859 3.80453V10.1682V21.1501H15.3035V3.80453C15.3035 3.27572 14.8748 2.84705 14.346 2.84705H10.5161C9.98727 2.84705 9.55859 3.27573 9.55859 3.80453Z" stroke="#DF1463" stroke-width="1.7" stroke-linecap="round"/>
         </svg>
        </NavLink>
        <NavLink to="/ErrorLogs" activeStyle>
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0619 4.4295C12.6213 3.54786 11.3636 3.54786 10.9229 4.4295L3.89008 18.5006C3.49256 19.2959 4.07069 20.2317 4.95957 20.2317H19.0253C19.9142 20.2317 20.4923 19.2959 20.0948 18.5006L13.0619 4.4295ZM9.34196 3.6387C10.434 1.45376 13.5508 1.45377 14.6429 3.63871L21.6758 17.7098C22.6609 19.6809 21.2282 22 19.0253 22H4.95957C2.75669 22 1.32395 19.6809 2.3091 17.7098L9.34196 3.6387Z" fill="white"/>
         <path d="M12 8V13" stroke="#DF1463" stroke-width="1.7" stroke-linecap="round"/>
         <path d="M12 16L12 16.5" stroke="#DF1463" stroke-width="1.7" stroke-linecap="round"/>
         </svg>
        </NavLink>
     </Nav>
  );
};
  
export default Navbar;