import React from "react";
import { NavLink as Link } from "react-router-dom";

const Navbar = () => {
return (
    <div>
        <Link to="/" activeStyle>
            Home
        </Link>
        <Link to="/about" activeStyle>
            About
        </Link>
    </div>
);
};

export default Navbar;