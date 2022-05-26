import React from 'react';
import PropTypes from 'prop-types';
import './ArrowControl.css';

function ArrowButton(props) {
  return (
    <button onClick={() => {props.onClickFunc(props.dir)}} className={['arrowButton',props.Class].join(" ")} >
      {props.Icon}
    </button>
  );
}

function  clickHandler(message) {
  console.log(`going ${message}`);
}

export default class ArrowControl extends React.Component {

 

  render() {
    return (
      <div className='container'>
        <ArrowButton Icon="ᐃ" dir='up' onClickFunc = {clickHandler} Class='upArrow' />
        <ArrowButton Icon="ᐊ" dir='left' onClickFunc = {clickHandler} Class='leftArrow' />
        <ArrowButton Icon="ᐁ" dir='down' onClickFunc = {clickHandler} Class='downArrow' />
        <ArrowButton Icon="ᐅ" dir='right' onClickFunc = {clickHandler} Class='rightArrow' />
        {/* <ArrowButton Icon="🛑" dir='stop' onClickFunc = {clickHandler} Class='stopButton' /> */}
      </div>
    );
  }
}

