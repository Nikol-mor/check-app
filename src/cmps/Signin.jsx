import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Button, TextField } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';

export function Signin({ onSignin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const user = await Auth.signIn(username, password);
      navigate('/');
      onSignin();
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  return (
    <div className='login'>
      <TextField
        id='username'
        label='Username'
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <TextField
        id='password'
        label='Password'
        value={password}
        type='password'
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button id='login-btn' color='primary' onClick={signIn}>
        Sign In
      </Button>
    </div>
  );
}
