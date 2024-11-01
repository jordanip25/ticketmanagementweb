import React from 'react';
import Menu from '../Dashboard/Menu.tsx';
import styled from 'styled-components';

const StyledApp = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 3em;
  justify-content: space-around;

  & > div:not(:last-child) {
    margin-bottom: 2em;
  }
`;

const App: React.FC = () => {
  return (
    <StyledApp>
      <Menu />
    </StyledApp>
  );
}

export default App;
