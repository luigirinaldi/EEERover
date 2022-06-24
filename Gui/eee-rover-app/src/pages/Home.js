import React, { useContext } from 'react';
import styled from "styled-components";
import PageContainer from './PageContainer';
import { MyChart } from '../components/Graph'
import { MotorControlSection } from './MotorControl';
import { DebugOutput } from '../components/DebugOutput';
import { IpContext } from '../context/ip-context';
import { RockData } from '../components/RockProcessing';

const RowContainer = styled.div`
  height: 100%;
  width: 100%;

  display: grid;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  grid-template-areas: "row1 row2 row3 row4";
`

const Row1 = styled.div`
grid-area: row1;
display: flex;
flex-direction: column;
`

const Row2 = styled.div`
  grid-area: row2;
  height: 80vh;
`

const Row3 = styled.div`
  grid-area: row3;
  display: flex;
`

const Row4 = styled.div`
  grid-area: row4;
  display: flex;
]`

const Home = () => {
  const { roverIP } = useContext(IpContext);
  return (
    <PageContainer title='Home'>
      <RowContainer>
        <Row1>
          <MotorControlSection />
        </Row1>
        <Row2>
          <MyChart startchar={2} endchar = {5} title={"RadioModulation"}/>
          <MyChart startchar={7} endchar = {9} title={"RadioCarrier"}/>
          <MyChart startchar={11} endchar = {14} title={"Infared"}/>
          <MyChart startchar={16} endchar = {18} title={"Acoustic"}/>
          <MyChart startchar={34} endchar = {39} title={"Magnetic"}/>
        </Row2>
        <Row3>
          <DebugOutput Title="Arduino Responses" IP={roverIP} types={['move','test','error', 'data']} />
        </Row3>
        <Row4>
          <RockData/>
        </Row4>
      </RowContainer>
    </PageContainer>
  );
};
  
export default Home;