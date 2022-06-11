import React from 'react';
import './ArrowControl.css';

function ArrowButton(props) {
  return (
    <button onClick={() => {props.onClickFunc(props.dir)}} className={['arrowButton',props.Class].join(" ")} >
      {props.Icon}
    </button>
  );
}

export default class ArrowControl extends React.Component { 

  constructor(props){
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className='container'>
        <ArrowButton Icon="ᐃ" dir='up' onClickFunc = {this.props.clickHandler} Class='upArrow' />
        <ArrowButton Icon="ᐊ" dir='left' onClickFunc = {this.props.clickHandler} Class='leftArrow' />
        <ArrowButton Icon="ᐁ" dir='down' onClickFunc = {this.props.clickHandler} Class='downArrow' />
        <ArrowButton Icon="ᐅ" dir='right' onClickFunc = {this.props.clickHandler} Class='rightArrow' />
        <ArrowButton Icon="↷" dir='clockwise' onClickFunc = {this.props.clickHandler} Class='clwButton' />
        <ArrowButton Icon="↶" dir='anticlockwise' onClickFunc = {this.props.clickHandler} Class='aclwButton' />
        <ArrowButton Icon="🛑" dir='stop' onClickFunc = {this.props.clickHandler} Class='stopButton' />
      </div>
    );
  }
}

