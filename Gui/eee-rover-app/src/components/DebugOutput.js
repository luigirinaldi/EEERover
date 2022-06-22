import React from "react";
import styled from "styled-components";

// to interact with main process
const electron = window.require('electron');
const { ipcRenderer } = electron;

const ContainerDiv = styled.div`
  background-color: #26343f; 
  height: 100%;
  width: 100%;
  overflow-y: hidden;

  display:flex;
  flex-direction: column;
`;

const TitleContainerDiv = styled.div`
  flex: 0 1 auto;

  background-color: #15232e; 
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5em 1em;
`;

const TitleSpan = styled.span`
  color: white;
  font-size: large;
  font-weight: bold;
`

const IpSpan = styled.span`
  color: grey;
  font-size: medium;
  font-family: monospace;
  font-style: italic;
`

const ContentDiv = styled.div`
  flex: 1 1 80vh;

  display: flex;
  flex-direction: column; 
  overflow-y: auto;

  max-height: 85vh; // need otherwise overflow won't work
`;

const Separator = styled.hr`
  border-top: 3px solid  #DF1463;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  margin: 0;
  padding:0;
`

const FooterContainer = styled.div`
  flex: 0 1 2.5vh;
  background-color: #15232e; 
`

export function ResponseElement(props) {
  const { time, timeTaken , msg } = props;
  return(
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0.5em 0.7em",
        gap: "0.5em",
      }}> 
      <span
        style={{
          color: "grey",
          fontSize: "medium",
          fontFamily: "monospace",
        }}>
          {time} ({timeTaken}):
      </span>

      <span
        style={{
          color: "white",
          fontSize: "large",
          fontFamily: "monospace",
        }}>
          {msg}
      </span>
    </div>
  );
}

export class DebugOutput extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      responses: [],
    }
  }
  componentDidMount() {
    ipcRenderer.on('received-udp-message', (event, arg) => {
      console.log(arg)
    })  
  }

  componentWillUnmount(){
    ipcRenderer.removeAllListeners();
  }

  render(){
      const { Title, IP } = this.props;
      return(
        <ContainerDiv>
          <TitleContainerDiv>
            <TitleSpan>
              {Title} 
            </TitleSpan>
            <IpSpan>
              IP: {IP}
            </IpSpan>
          </TitleContainerDiv>
          <Separator />
          <ContentDiv>
            {this.state.responses}
          </ContentDiv>
          <Separator />
          <FooterContainer />
        </ContainerDiv>
    )
  }
}
