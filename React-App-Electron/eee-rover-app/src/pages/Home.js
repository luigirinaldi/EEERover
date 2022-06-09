import React from 'react';
import PageContainer from './PageContainer';

const HTTPButton = () => {
  async function HttpRequest(){
    let response = await fetch('http://172.20.10.7/move?dir=2&sped=255', {
      method: 'GET',
      mode: 'cors',
    });

    console.log(response.json);
  }
  
  
  return (
    <button onClick={HttpRequest}>
      http request
    </button>
  );
};

const Home = () => {
  return (
    <PageContainer>
      <div>
        <h1>Home Page</h1>
        <HTTPButton />
      </div>
    </PageContainer>
  );
};
  
export default Home;