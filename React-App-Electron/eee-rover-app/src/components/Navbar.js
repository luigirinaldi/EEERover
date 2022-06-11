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
        <NavLink to="/MotorControl" activeStyle>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.99989 7H8.99989M6.99989 5V9M13.9999 8H14.0099M16.9999 6H17.0099M9.44885 1H12.5509C15.1758 1 16.4883 1 17.5184 1.49743C18.4254 1.9354 19.179 2.63709 19.6805 3.51059C20.2501 4.5027 20.3436 5.81181 20.5306 8.43002L20.7766 11.8745C20.8973 13.5634 19.5597 15 17.8664 15C17.0005 15 16.1794 14.6154 15.6251 13.9502L15.2499 13.5C14.9068 13.0882 14.7351 12.8823 14.5398 12.7159C14.1302 12.3672 13.6344 12.1349 13.1043 12.0436C12.8514 12 12.5834 12 12.0473 12H9.95245C9.41642 12 9.14841 12 8.89553 12.0436C8.36539 12.1349 7.86957 12.3672 7.46 12.7159C7.26463 12.8823 7.09305 13.0882 6.74989 13.5L6.37473 13.9502C5.8204 14.6154 4.99924 15 4.13335 15C2.44013 15 1.1025 13.5634 1.22314 11.8745L1.46918 8.43002C1.65619 5.81181 1.7497 4.5027 2.31926 3.51059C2.82074 2.63709 3.57433 1.9354 4.48135 1.49743C5.51151 1 6.82396 1 9.44885 1Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4.99989 7H8.99989M6.99989 5V9M13.9999 8H14.0099M16.9999 6H17.0099M9.44885" stroke="#DF1463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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