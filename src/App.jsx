import './App.css';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useEffect, useState } from 'react';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter as Router, Switch, Route, Link, Routes } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { TodoList } from './cmps/TodoList';
import { Signin } from './cmps/Signin';

Amplify.configure(awsconfig);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const isLoggedIn = () => {
    Auth.currentAuthenticatedUser()
      .then((sess) => {
        console.log('sess', sess);
        console.log('logged in');
        setLoggedIn(true);
      })
      .catch(() => {
        console.log('not logged in');
        setLoggedIn(false);
      });
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  const onSignOut = async () => {
    try {
      await Auth.signOut();
      setLoggedIn(false);
    } catch (error) {
      console.log('error signing out', error);
    }
  };

  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <AmplifySignOut />
          {/* {loggedIn ? (
            <Button onClick={onSignOut} variant='contained' color='primary'>
              Log Out
            </Button>
          ) : (
            <Link to='/signin'>
              <Button variant='contained' color='primary'>
                Log In
              </Button>
            </Link>
          )} */}
          <h2>My App Content</h2>
        </header>
        <TodoList />

        {/* <Routes> */}
        {/* <Route path='/signin' element={<Signin onSignin={isLoggedIn} />} /> */}
        {/* <Route exact path='/' element={<TodoList />} /> */}
        {/* </Routes> */}
      </div>
    </Router>
    // <Router>
    //   <div className='App'>
    //     <header className='App-header'>
    //       {/* <AmplifySignOut /> */}
    //       {loggedIn ? (
    //         // <Link to='/'>
    //         <Button onClick={onSignOut} variant='contained' color='primary'>
    //           Log Out
    //         </Button>
    //       ) : (
    //         // </Link>
    //         <Link to='/signin'>
    //           <Button variant='contained' color='primary'>
    //             Log In
    //           </Button>
    //         </Link>
    //       )}
    //       <h2>My App Content</h2>
    //     </header>
    //     {/* <Routes>
    //       <Route exact path='/' element={<TodoList />} />
    //     </Routes> */}
    //     <Routes>
    //       <Route exact path='/'>
    //         <TodoList />
    //       </Route>
    //       <Route path='/signin'>
    //         <Signin onSignin={isLoggedIn} />
    //       </Route>

    //       {/* <Route exact={true} path='/signin' elemene={<Signin />} /> */}
    //     </Routes>
    //   </div>
    // </Router>
  );
}

// export default App;
export default withAuthenticator(App, { includeGreetings: true });
