import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Chat from './components/Chat';



function App() {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setUserAuthenticated(true);
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user-headers") {
        const newValue = event.newValue;
        if (newValue !== null) {
          const parsedHeaders = JSON.parse(newValue);
          setUserAuthenticated(parsedHeaders.uid !== "");
        } else {
          setUserAuthenticated(false);
        }
      }
    };

    // Listen for changes in session storage
    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="app">
      <Router>
        {!userAuthenticated ? (
          <Login onLoginSuccess={handleLoginSuccess} /> 
        ) : (
          <>
            <Header />
            <AppBody>
            <Sidebar userEmail={userEmail} />
              <Routes>
                <Route path="/:roomType/:roomId" element={<Chat />} />
              </Routes>
             
            </AppBody>
          </>
        )}
      </Router>
    </div>
  );
}

const AppBody = styled.div`
  display: flex;
  height: 100vh;
  
`;

export default App;
