import React from 'react';
import styled from 'styled-components';
import { Avatar as MUIAvatar } from '@mui/material';

function Message({ message, user }) {
  return (
    <MessageContainer>
      <MUIAvatar className='message_avatar' alt='' src='' />
      <MessageInfo>
        <h4>{user}</h4>
        <p>{message}</p>
      </MessageInfo>
    </MessageContainer>
  );
}

export default Message;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;

  > .message_avatar {
    height: 50px;
    border-radius: 8px;
  }
`;

const MessageInfo = styled.div`
  padding-left: 10px;
`;
