import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
  
export const Nav = styled.nav`
    background-color: #15232e; 
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    x-overflow: hidden;
    margin: 0;
`;
  
export const NavLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  padding: 1.5em;
  &.active {
    background-color: #26343f;
  };
  &:hover {
    background-color: #26343f;
  };
`;