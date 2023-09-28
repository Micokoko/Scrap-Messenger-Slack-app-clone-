import { InfoOutlined, StarBorderOutlined } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Message from './Message';
import ChatInput from './ChatInput';
import { useParams } from 'react-router-dom';

function Chat() {
  const { roomId, roomType } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const chatRef = useRef(null);

  // Define accessToken, client, expiry, and uid variables here
  const accessToken = sessionStorage.getItem('access-token');
  const client = sessionStorage.getItem('client');
  const expiry = sessionStorage.getItem('expiry');
  const uid = sessionStorage.getItem('uid');

  const fetchUsers = async () => {
    let response = await fetch('http://206.189.91.54/api/v1/users', {
      method: 'GET',
      headers: {
        'access-token': accessToken,
        'client': client,
        'expiry': expiry,
        'uid': uid,
      },
    });
    const db = await response.json();
    return db.data;
  }

  const loadRoomDetails = async () => {
    try {
      if (roomType === 'Channel') {
        const response = await fetch(
          `http://206.189.91.54/api/v1/channels/${roomId}`,
          {
            method: 'GET',
            headers: {
              'access-token': accessToken,
              'client': client,
              'expiry': expiry,
              'uid': uid,
            },
          }
        );
        const data = await response.json();
        console.log('Channel Details:', data);
        setRoomDetails(data.data);
      } else {
        let userId = roomId;
        let userName = '';
      
        const recentContacts = JSON.parse(localStorage.getItem("recent-contacts"));
      
        // Find the recent contact object in local storage where the id matches userId
        const recentContact = recentContacts.find(contact => contact.userId == userId);
      
        if (recentContact) {
          userName = recentContact.userName; // Get the 'userName' property from the recent contact object
          console.log('User:', userName);
          setRoomDetails(userName);
        } else {
          console.log('User not found in recent contacts.');
          console.log(userId);
          console.log(userName);
          console.log(recentContacts);
          console.log(recentContact);
        }
      }
    } catch (error) {
      console.error('Error loading room details:', error);
    }
  };
  
  

  const loadRoomMessages = async () => {
    try {
    

      const response = await fetch(
        `http://206.189.91.54/api/v1/messages?receiver_id=${roomId}&receiver_class=${roomType}`,
        {
          method: 'GET',
          headers: {
            'access-token': accessToken,
            'client': client,
            'expiry': expiry,
            'uid': uid,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // The updated code sets roomMessages directly without further processing
        setRoomMessages(data.data);
      } else {
        console.error('Failed to fetch room messages:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching room messages:', error);
    }
  };

  const addMember = async () => {
    console.log('Current roomId:', roomId); // Log the roomId
  
    const userName = prompt('Please enter the email of the user you want to add to the channel')?.toString();
    let userId = [];
  
    if (userName) {
      const db = await fetchUsers();
  
      // Find the user object in the database where uid matches userName
      const user = db.find(user => user.uid === userName);
  
      if (user) {
        userId = user.id; // Get the 'id' property from the user object
        console.log('User found:', user); // Log the user object
  
        let response = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
          method: 'POST',
          headers: {
            'access-token': accessToken,
            'client': client,
            'expiry': expiry,
            'uid': uid,
          },
          body: JSON.stringify({
            id: roomId,
            member_id: userId,
          }),
        });
        const data = await response.json();
        console.log('Add Member', data);
  
        if (data.errors) {
          alert(data.errors);
          console.log('User was not added to the channel.');
        } else {
          alert('Member successfully added');
          console.log('User was added to the channel.');
        }
      } else {
        console.log('User not found in the database.');
      }
    }
  }
  
  useEffect(() => {
    loadRoomDetails();
    loadRoomMessages();
    chatRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [roomId]);


  return (
    <ChatContainer>
      {roomDetails ? (
        <Header>
          <HeaderLeft>
            <h4>
            <strong>#{roomDetails.name}</strong>
            </h4>
            <StarBorderOutlined />
          </HeaderLeft>
          <HeaderRight>
            <p>
              <InfoOutlined /> Details
            </p>
            {roomType === 'Channel' && <AddIcon onClick={addMember} />}
          </HeaderRight>
        </Header>
      ) : null /* Conditionally render the header based on roomDetails */}
      <ChatMessages>
        {roomMessages && roomMessages.length > 0 ? (
          roomMessages.map(({ body, id, sender, userImage }) => (
            <Message
              key={id}
              message={body}
              user={sender ? sender.uid : ''}
              userImage={userImage}
            />
          ))
        ) : (
          <p>No messages available.</p>
        )}
        <ChatBottom ref={chatRef} />
      </ChatMessages>
      <ChatInput channelName={roomType === 'Channel' ? (roomDetails ? roomDetails.name : '') : (roomDetails || '')} channelId={roomId} roomType={roomType} loadRoomMessages={loadRoomMessages} />
    </ChatContainer>
  );
  
};

export default Chat;

const Header = styled.div`
 position: fixed;
  top: 75px; /* Adjust the top padding as needed */
  left: 260px; /* Adjust the left padding as needed */
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
  background-color: #E6DDC4;
  z-index: 1; /* Ensures the header is on top */
`;

const ChatMessages = styled.div`

`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;

  > h4 {
    display: flex;
    text-transform: lowercase;
    margin-right: 10px;
  }

  > h4 > .MuiSvgIcon-root {
    margin-left: 20px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  > p {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  > p > .MuiSvgIcon-root {
    margin-right: 5px !important;
    font-size: 16px;
  }
`;

const ChatContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 90px;
`;

const ChatBottom = styled.div`
  padding-bottom: 200px;
`;
