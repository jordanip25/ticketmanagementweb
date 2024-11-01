import { useState } from 'react';
import styled from 'styled-components';
import Board from '../Board/Board'; // Ajusta la ruta según la ubicación del componente Board

const MenuContainer = styled.div`
  width: 200px;
  background-color: #a4a4a4;
  padding: 10px;
  border-right: 1px solid #ddd;
  height: 35em;
`;

const MenuItem = styled.div<{ isActive: boolean }>`
  padding: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#e0e0e0' : 'transparent')};
  &:hover {
    background-color: #d0d0d0;
  }
`;

const DashboardContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
`;

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Board');

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  return (
    <DashboardContainer>
      <MenuContainer>
        <MenuItem isActive={activeMenu === 'Board'} onClick={() => handleMenuClick('Board')}>
          Board
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Projects'} onClick={() => handleMenuClick('Projects')}>
          Projects
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Tasks'} onClick={() => handleMenuClick('Tasks')}>
          Tasks
        </MenuItem>
        <MenuItem isActive={activeMenu === 'Settings'} onClick={() => handleMenuClick('Settings')}>
          Settings
        </MenuItem>
      </MenuContainer>
      <ContentContainer>
        {activeMenu === 'Board' && <Board />}
        {activeMenu === 'Projects' && <div>Contenido de Projects</div>}
        {activeMenu === 'Tasks' && <div>Contenido de Tasks</div>}
        {activeMenu === 'Settings' && <div>Contenido de Settings</div>}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;
