import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SearchIcon from '@mui/icons-material/Search';
import { HelpOutline } from '@mui/icons-material';

function Header() {
    
  const handleAvatarClick = () => {
    
    window.location.reload();
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
      <HeaderAvatar onClick={handleAvatarClick} />
          
        <AccessTimeFilledIcon />
      </HeaderLeft>
      <HeaderSearch>
        <input type="text" placeholder="Search..." />
        <SearchIcon />
      </HeaderSearch>
      <HeaderRight>
      <img src="https://www.svgrepo.com/show/361458/crumpled-paper.svg"alt="Scrap Logo"/>
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderSearch = styled.div`
  flex: 0.4;
  opacity: 1;
  border-radius: 6px;
  border-color: lightgray;
  text-align: center;
  display: flex;


  > input {
    background-color: #F0E9D2;
    flex: 0.4;
    opacity: 1;
    border-radius: 6px;
    border: none;
    text-align: center;
    min-width: 30vw;
    outline: 0;
    color: black;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 17px 0;
  background-color: var(--slack-color);
  color: white;
`;

const HeaderLeft = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  margin-left: 20px;

  > .MuiSvgIcon-root {
    margin-left: auto;
    margin-right: 30px;
  }
`;

const HeaderRight = styled.div`
  flex: 0.3;
  display: flex;
  align-items: flex-end;

  > img {
    width: 40px;
    margin-left: auto;
    margin-right: 20px;
  }
`;

const HeaderAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;
