import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import Spinner from 'react-spinkit'
import { useNavigate } from 'react-router-dom';


function Login({ onLoginSuccess }) {
  
  const navigate = useNavigate ()

    const baseUrl = 'http://206.189.91.54/api/v1/'
    const loginUrl = baseUrl +'auth/sign_in'
    const signUpUrl = baseUrl + '/auth'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([])
    const [data, setData] =  useState(null)
    const [loading, setLoading] = useState(false)
    const [showSignUpForm, setShowSignUpForm] = useState(false); // Initially hidden
    const [newPassword, newSetPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newEmail, newSetEmail] = useState('');
   

    const showSignUp = () => {
      setShowSignUpForm(true); // Show the sign-up form when the button is clicked
    };
  

    const signIn = async (e) => {
      e.preventDefault();
      setErrors([]);
      setData(null);
      setLoading(true);
    
      const payload = {
        email: email,
        password: password,
      };
    
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          // Capture the necessary headers
          const accessToken = response.headers.get('access-token');
          const client = response.headers.get('client');
          const expiry = response.headers.get('expiry');
          const uid = response.headers.get('uid');
    
          // Set the headers in sessionStorage
          sessionStorage.setItem('access-token', accessToken);
          sessionStorage.setItem('client', client);
          sessionStorage.setItem('expiry', expiry);
          sessionStorage.setItem('uid', uid);
    
          // Notify the parent component of successful login
          onLoginSuccess(email);
    
          // Redirect the user to the next page
          navigate('/'); // Change '/next-page' to the actual URL of the next page
        } else {
          // Handle login errors here, e.g., show an error message.
          console.error('Login failed.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    
      setLoading(false);
    }

      const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit Button pressed');     
        
        if (newPassword.length < 6){
        alert("Password is too short");
        return;
        }

      
        if (newPassword !== repeatPassword) {
          alert("Password and Repeat Password don't match.");
          return;
        }
      
        const payload = {
          email: newEmail,
          password: newPassword,
          password_confirmation: repeatPassword,
        };
      
        try {
          const response = await fetch(signUpUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          if (response.ok) {
            alert('User registered successfully.');
          } else {
            console.error('Registration failed.');
          }
        } catch (error) {
          console.error('An error occurred during registration:', error);
        }
      };
      

      
 
      return (
        <LoginContainer>
        <LoginInnerContainer>
          {loading ? (
            // Check if loading state is true
            <LoadingContainer>
              <img
                src="https://www.svgrepo.com/show/361458/crumpled-paper.svg"
                alt="Slack Logo"
              />
              <Spinner name="ball-spin-fade-loader" color="#272829" fadeIn="none" />
            </LoadingContainer>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/361458/crumpled-paper.svg"
                alt="Scrap Logo"
              />

              <h1>Scrap Messenger</h1>
              <h2>Sign In</h2>
              <p>MicokokoSlackClone</p>
  
              {!showSignUpForm && ( // Conditionally render the LoginDetailsContainer
                <LoginDetailsContainer>
                  <h4>Email Address</h4>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <h4>Password</h4>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    value={password}
                  />
                  
                    {errors.length > 0 && <span style={{ color: 'red' }}> {errors[0]}</span>}
                    {data && <span style={{ color: 'green' }}> Success</span>}
  
                  <Button onClick={signIn}>Log in</Button>
  
                  <Button onClick={showSignUp}>Create an account</Button>
                    
                </LoginDetailsContainer>
              )}
  
              
            </>
          )}
  
          {showSignUpForm && ( // Conditionally render the sign-up form
            <SignUpForm>
              <form onSubmit={handleSignUpSubmit}>
                <h3>Email Address</h3>
                <input
                  className="input-field"
                  onChange={(e) => newSetEmail(e.target.value)}
                  placeholder="Email Address"
                  type="email"
                  value={newEmail}
                />
                <h3>Password</h3>
                <input
                  className="input-field"
                  onChange={(e) => newSetPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  value={newPassword}
                />
                <h3>Repeat Password</h3>
                <input
                  className="input-field"
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="Repeat Password"
                  type="password"
                  value={repeatPassword}
                />
  
                <Button type="submit">Sign Up</Button>
              </form>
            </SignUpForm>
          )}
        </LoginInnerContainer>
      </LoginContainer>
    );
  }

export default Login;

const LoginContainer = styled.div`
  background-color: #181D31;
  height: 100vh;
  display: grid;
  place-items: center;
`;

const LoginInnerContainer = styled.div`
  
  padding: 100px;
  text-align: center;
  background-color: #678983;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  > h1 {
    margin: 10px;
  }

  > img {
    object-fit: contain;
    height: 200px;
    margin-bottom: 40px;
  }

  > button {
    margin-top: 20px;
    text-transform: inherit !important;
    background-color: #0a8d48 !important;
    color: white;
  }
`;
const LoginDetailsContainer = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: left;
  margin-top: 20px;

  > h4 {
    font-size: 1.2rem;
  }

  > input {
    width: 300px;
    height: 25px;
    border-radius: 10px;
    font-size: 1rem;
  }
  
  > button {
    margin-left: 60px;
    width: 200px;
    margin-top: 50px;
    font-weight: 600;
    color: black;
    background-color: #D8D9DA !important;
  }
`;

const LoadingContainer = styled.div`
    text-align: center;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  > img {
    height: 100px;
    padding: 20px;
    margin-bottom: 40px;
  }
`;

const SignUpContainer = styled.div`
  margin-top: 10px;
`;

const SignUpForm = styled.div`
  margin-top: 20px;
  text-align: left;

  > h3 {
    text-align: left;
    margin-bottom: 10px;
  }

  > form {
    display: flex;
    flex-direction: column;
    align-items: left;
   
  }

  > form > h3 {
    font-weight: 700;
  }

  > form > input {
    width: 300px;
    height: 25px;
    margin-bottom: 8px;
    text-align: left;
    font-size: 20px;
    font-weight: 200;
  }

  > form > button {
    margin-top: 20px;
    margin-left: 100px;
    width: 100px;
    height: 50px;
    font-size: 15px;
    font-weight:600;
    background-color: #0a8d48 !important;
    color: white;
  }
`;
