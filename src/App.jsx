import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useEffect, useState } from 'react';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { TodoList } from './cmps/TodoList';
import { AppFooter } from './cmps/AppFooter';

Amplify.configure(awsconfig);

function App() {
  const [loggedInId, setLoggedInId] = useState(null);
  const [username, setUsername] = useState('');

  const isLoggedIn = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUsername(user.username);
      })
      .catch(() => {
        console.log('not logged in');
        setLoggedInId(false);
      });
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <AmplifySignOut />
        <h5>Hello {username}</h5>
        <h2>Check App</h2>
      </header>
      <div className='main-container'>
        <TodoList />
      </div>
      <footer>
        <AppFooter />
      </footer>
    </div>
  );
}

export default withAuthenticator(App);
