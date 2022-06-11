import React from "react";
import styled from "styled-components";

export const containerDiv = styled.div`
  border: thin solid #DF1463;
  background-color: #15232e; 
`;

export const titleDiv = styled.div`
  border-radius: 24px 24px 0 0;
  border: thin solid #DF1463;
  background-color: #15232e; 
`;

export const contentDiv = styled.div`
  border-radius: 0 0 24px 24px;
  border: thin solid #DF1463;
  background-color: #26343f; 
`;

class DebugOutput extends React.Component {
  render(){
    return(
      <containerDiv>
        <titleDiv>
          <p>Title</p>
        </titleDiv>
        <contentDiv>
          <p>Content</p>
        </contentDiv>
      </containerDiv>
  )}
}

export default DebugOutput;