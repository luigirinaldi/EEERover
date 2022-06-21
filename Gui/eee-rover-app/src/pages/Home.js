import React from 'react';
import PageContainer from './PageContainer';

const HTTPButton = () => {
  async function HttpRequest(){
    fetch('http://172.20.10.7/move?dir=1&sped=23', {
      method: 'GET',
      // mode: 'cors',
      Host: `http://${window.location.host}/`,
      Origin: 'http://172.20.10.7/',
      'Referrer-Policy': 'origin-when-cross-origin',
    })
    .then(response => response.text())
    .then((dataStr) => {
      console.log(dataStr);
    });

    // console.log(response.body);
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