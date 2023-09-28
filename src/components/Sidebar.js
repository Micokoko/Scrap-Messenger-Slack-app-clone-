import {
  Apps,
  BookmarkBorder,
  Drafts,
  FiberManualRecord,
  FileCopy,
  Inbox,
  PeopleAlt,
} from '@mui/icons-material';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CreateIcon from '@mui/icons-material/Create';
import SidebarOption from './SidebarOption';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

function Sidebar({ userEmail }) {
  const baseUrl = 'http://206.189.91.54/api/v1/';
  const channelListUrl = baseUrl + 'channels';
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const accessToken = sessionStorage.getItem('access-token');
  const client = sessionStorage.getItem('client');
  const expiry = sessionStorage.getItem('expiry');
  const uid = sessionStorage.getItem('uid');

  const fetchChannels = async () => {
    try {

      if (!accessToken || !client || !expiry || !uid) {
        console.error('One or more required headers are missing');
        return;
      }

      const response = await fetch(channelListUrl, {
        headers: {
          'Content-Type': 'application/json',
          'access-token': accessToken,
          'client': client,
          'expiry': expiry,
          'uid': uid,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data) && data.data.length === 0) {
          setError('No channels available');
        } else {
          setChannels(data.data);
          setError(null);
        }

        setLoading(false);
      } else {
        console.error('Failed to fetch channels:', response.statusText);
        setLoading(false);
      }
    } catch (error) {
      console.error('An error occurred while fetching channels:', error);
      setLoading(false);
    }
  };

  // Modify the loadDirectMessages function
const loadDirectMessages = async () => {
  // Retrieve recent contacts from local storage
  const recentContacts = JSON.parse(localStorage.getItem("recent-contacts")) || [];
  // Initialize an array to store direct messages
  const messages = [];
  // Create a Headers object for the request headers
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('access-token', accessToken);
  headers.append('client', client);
  headers.append('expiry', expiry);
  headers.append('uid', uid);

  // Iterate over each recent contact
  for (const recentContact of recentContacts) {
    const { userId } = recentContact;

    // Make a request to fetch direct messages for the user
    let response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${userId}&receiver_class=User`, {
      method: 'GET',
      headers: headers, // Use the Headers object
    });

    const data = await response.json();

    // Check if the fetched data is not null
    if (!data.errors) {
      messages.push(...data.data);
    }
  }
  console.log('DM', messages);
  // Set the directMessages state with the fetched messages
  setDirectMessages(messages);
};

// Modify the newMessage function


  

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarInfo>
          <h2>SCRAP</h2>
          <h3>
            <FiberManualRecord />
            {userEmail}
          </h3>
        </SidebarInfo>
        <CreateIcon />
      </SidebarHeader>
      <SidebarOption Icon={ExpandMoreIcon} title="Channels" />
      <hr />
      <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel" fetchChannels={fetchChannels} />

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
         {Array.isArray(channels) ? (
      !loading && channels.map(channel => (
      <SidebarOption title={channel.name} id={channel.id} key={channel.id} type='Channel' channels={channels} />
      ))
        ) : (
        <p>No channels available</p>
        )}
        <hr />
        <SidebarOption Icon={ExpandMoreIcon} directMessages title="Direct messages" />
        <hr />
        <SidebarOption Icon={AddIcon} newMessageOption title='New Message' loadDirectMessages={loadDirectMessages} />
        {[...new Set(directMessages?.map((directMessage) => directMessage.receiver?.id))].map((uniqueReceiverId) => {
        const correspondingMessage = directMessages.find((message) => message.receiver?.id === uniqueReceiverId);
        return (
          <SidebarOption title={correspondingMessage.receiver?.uid} id={uniqueReceiverId} key={uniqueReceiverId} type='User' />
        );
        })}
        </>
      )}
    </SidebarContainer>
  );
}

export default Sidebar;

const SidebarContainer = styled.div`
  background-color: var(--slack-color);
  color: white;
  flex: 0.3;
  border-top: 1px solid #678983;
  max-width: 260px;
  margin-top: 60px;

  > hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #678983;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #678983;
  padding-bottom: 10px;
  padding: 13px;

  > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 999px;
  }
`;

const SidebarInfo = styled.div`
  flex: 1;

  > h2 {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 5px;
  }

  > h3 {
    display: flex;
    font-size: 13px;
    font-weight: 400;
    align-items: center;
  }

  > h3 > .MuiSvgIcon-root {
    font-size: 24px;
    margin-top: 1px;
    margin-right: 2px;
    color: green;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  margin: 10px;
  text-align: center;
`;
