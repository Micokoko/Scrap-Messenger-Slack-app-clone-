import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';



function SidebarOption({ Icon, title, type, addChannelOption, id, fetchChannels, loadDirectMessages, newMessageOption  }) {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem('access-token');
  const client = sessionStorage.getItem('client');
  const expiry = sessionStorage.getItem('expiry');
  const uid = sessionStorage.getItem('uid');

  const selectChannel = () => {
    if (id) {
      console.log('Selected Channel ID:', id);
      navigate(`/${type}/${id}`);
    } else {
      navigate(title);
    }
  };

  const addChannel = async () => {
    try {
      const channelName = prompt('Please enter the channel name');
      if (!channelName) {
        // Handle the case where the channel name is blank
        console.error('Channel name cannot be blank');
        return;
      }
  
      // Retrieve the necessary headers from sessionStorage
 
  
      // Check if any of the headers are missing
      if (!accessToken || !client || !expiry || !uid) {
        console.error('One or more required headers are missing');
        return;
      }
  
      const response = await fetch('http://206.189.91.54/api/v1/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-token': accessToken,
          'client': client,
          'expiry': expiry,
          'uid': uid,
        },
        body: JSON.stringify({
          name: channelName,
          user_ids: [], // Replace with the desired user IDs
        }),
      });
      const data = response.json()
      if (response.ok) {
        console.log('Channel created successfully:', response, data);
        alert ('Channel has been created successfully')
        // Add logic here if needed.
      } else {
        console.error('Failed to create channel:', response.statusText);
        fetchChannels()
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchDatabase = async () => {
    let response = await fetch('http://206.189.91.54/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access-token': accessToken,
        'client': client,
        'expiry': expiry,
        'uid': uid,
      },
      })
      const db = await response.json();
      console.log(db);
      return db.data;
  }
  

  const newMessage = async () => {
    const userName = prompt('Please enter email of the user you want to send a message to')?.toString();
    const message = prompt("Please enter the message you'd like to send to the user");
    let userId = [];
    
    if (userName && message) {
      const db = await fetchDatabase();
      
      // Find the user object in the database where uid matches userName
      const user = db.find(user => user.uid === userName);
  
      if (user) {
        userId = user.id; // Get the 'id' property from the user object
        console.log('User ID:', userId);
      } else {
        console.log('User not found in the database.');
      }
      
      // Create a Headers object for the request headers
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('access-token', accessToken);
      headers.append('client', client);
      headers.append('expiry', expiry);
      headers.append('uid', uid);
  
      let response = await fetch('http://206.189.91.54/api/v1/messages', {
        method: 'POST',
        headers: headers, // Use the Headers object
        body: JSON.stringify({
          receiver_id: userId,
          receiver_class: 'User',
          body: message,
        })
      });
      const data = await response.json();
      console.log('New Message', data);
      if (data.errors) {
        alert(data.errors);
      } else {
        // Create a new recent contact object
        let recentContact = { userName, userId };
  
        // Check if there are existing recent contacts in local storage
        let existingRecentContacts = JSON.parse(localStorage.getItem('recent-contacts')) || [];
  
        // Check if the recent contact already exists in the list
        let contactExists = existingRecentContacts.some((contact) => contact.userId === userId);
  
        // If the contact does not exist, add it to the list
        if (!contactExists) {
          existingRecentContacts.push(recentContact);
        }
  
        // Save the updated list of recent contacts back to local storage
        localStorage.setItem('recent-contacts', JSON.stringify(existingRecentContacts));
  
        loadDirectMessages();
        navigate(`/User/${userId}`);
      }
    }
  };
  
 
  

  return (
    <SidebarOptionContainer onClick={addChannelOption ? addChannel : newMessageOption ? newMessage : selectChannel}>
      {Icon && <Icon fontSize='small' style={{ padding: 10 }} />}
      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <SideBarOptionChannel>
          <span>#</span> {title}
        </SideBarOptionChannel>
      )}
    </SidebarOptionContainer>
  );
}

export default SidebarOption;

const SidebarOptionContainer = styled.div`
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-left: 2px;
  cursor: pointer;

  :hover {
    background-color: gray;
    opacity: 0.9;
  }

  > h3 {
    font-weight: 500;
  }

  > h3 > span {
    padding: 15px;
  }
`;

const SideBarOptionChannel = styled.h3`
  padding: 10px 0;
  font-weight: 300;
`;
