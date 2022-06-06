// All of this done following the tutorial: https://codeburst.io/how-to-create-a-navigation-bar-and-sidebar-using-react-348243ccd93

import React from 'react';
import styled from "styled-components";
import {BrowserRouter as Router, Route, Link, useLocation } from 'react-router-dom';

const StyledNavItem = styled.div`
  height: 70px;
  width: 70px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin: 2em 0;
  font-size: 1em;
  text-decoration: none; /* Gets rid of underlining of icons */
  color: ${(props) => props.active ? "black" : "#9FFFCB"};
  :hover {
    opacity: 0.7;
  }  

  background-color : ${(props) => props.active ? "#9FFFCB" : "#333"};
  border-radius: 15px;
`;

const NavIcon = styled.div`
  font-size: 0.5em;
`;

class NavItem extends React.Component {

  handleClick = () => {
    const { path, onItemClick } = this.props;
    onItemClick(path);
  }

  render() {
    const {active} = this.props;

    return (
        <Link to={this.props.path} onClick={this.handleClick}>
          <StyledNavItem active={active}>
              <NavIcon>
              </NavIcon>
              {this.props.name}
          </StyledNavItem>
        </Link>
    );
  }
}

const StyledSideNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
  height: 100%;
  width: 90px;     /* Set the width of the sidebar */
  z-index: 1;      /* Stay on top of everything */
  /*top: 3.4em; */     /* Stay at the top */
  background-color: #111; /* Black */
  overflow-x: hidden;     /* Disable horizontal scroll */
  /* padding-top: 10px; */
  margin: 0;
`;

class SideNav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activePath: props.pathname,
      items: [
        {
          path: '/', /* path is used as id to check which NavItem is active basically */
          name: 'Home',
          key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
        },
        {
          path: '/debugMenu',
          name: 'Debug Menu',
          key: 2
        }, 
        {
          path: '/wifiDebug',
          name: 'Wifi Debug',
          key: 3
        },
        {
          path: '/motorDebug',
          name: 'Motor Debug',
          key: 4
        },
        {
          path: '/dataDebug',
          name: 'Data Debug',
          key: 5
        },
      ]
    }  
  }
  
  onItemClick = (path) => {
    this.setState({ activePath: path }); /* Sets activePath which causes rerender which causes CSS to change*/ 
  }

  render() {
    const { items, activePath } = this.state;
    return (
      <StyledSideNav>
        {
          // maps loops through items array and creates all the NavItems accordingly
          items.map((item) => {
            return (
              <NavItem path={item.path} name={item.name} onItemClick={this.onItemClick} active={item.path === activePath} key={item.key} />
            )
          })
        }
      </StyledSideNav>
    );
  }
}

// Weird workaround because react is weird
const RouterSideNav = () => {
  const { pathname } = useLocation();
  return (
    <SideNav pathname={pathname} />
  );
}

export default class Sidebar extends React.Component {
  render(){
    return (
      <RouterSideNav />
    );    
  }
}