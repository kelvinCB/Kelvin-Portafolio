import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';

const GlobalStyle = createGlobalStyle`
  body {
    background: #1a1333;
    margin: 0;
    font-family: 'Poppins', Arial, sans-serif;
  }
`;

const MainContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1333 70%, #ffb07c 100%);
  color: #fff;
`;

function App() {
  return (
    <MainContainer>
      <GlobalStyle />
      <AboutMe />
      <Portfolio />
    </MainContainer>
  );
}

export default App;
