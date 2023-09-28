import { Button } from '@mui/material';
import React, { useState } from 'react';
import styled from 'styled-components';

function ChatInput({ channelName, channelId, loadRoomMessages }) {
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const roomType = 'Channel'
  
    if (channelId && (roomType === 'User' || roomType === 'Channel')) {
      const accessToken = sessionStorage.getItem('access-token');
      const client = sessionStorage.getItem('client');
      const expiry = sessionStorage.getItem('expiry');
      const uid = sessionStorage.getItem('uid');
  
      if (!accessToken || !client || !expiry || !uid) {
        console.error('One or more required authentication headers are missing');
        // Handle the missing headers as needed
        return;
      }
  
      const apiUrl = 'http://206.189.91.54/api/v1/messages';
  
      const requestBody = {
        receiver_id: channelId,
        receiver_class: roomType,
        body: input,
      };
  
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'access-token': accessToken,
            'client': client,
            'expiry': expiry,
            'uid': uid,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          // Handle the error here
          return;
        }
  
        const data = await response.json();
        console.log('Message sent successfully:', data);
  
        // Clear the input after sending the message
        setInput('');
  
        // Load room messages after sending the message
        loadRoomMessages();
      } catch (error) {
        console.error('Error:', error);
        // Handle the error here
      }
    } else {
      console.error('Invalid channelId or roomType:', channelId, roomType);
      // Handle the invalid values here
    }
    setInput('');
  };

  return (
    <ChatInputContainer>
      <form>
      <input
       value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Message #${channelName?.toString().toLowerCase()}`}
        ></input>
        <Button hidden type="submit" onClick={sendMessage}>
          SEND
        </Button>
      </form>
    </ChatInputContainer>
  );
}

export default ChatInput;

const ChatInputContainer = styled.div`
  border-radius: 20px;

  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }

  > form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 20px;
    outline: none;
    background-color: #E6DDC4;
    font-weight: 500;
  }

  > form > button {
    display: none !important;
  }
`;
