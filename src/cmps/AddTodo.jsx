import { API, graphqlOperation, Auth } from 'aws-amplify';
import { createTodo } from '../graphql/mutations';
import { useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { v4 as uuid } from 'uuid';

export function AddTodo({ onUpload, userLogged }) {
  const [todoData, setTodoData] = useState({});

  const addTask = async () => {
    console.log('todoData', todoData);
    const { text } = todoData;
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user.attributes.sub in add', user.attributes.sub);
      const createTodoInput = {
        text,
        ownerId: user.attributes.sub,
        isdone: false,
      };
      await API.graphql(graphqlOperation(createTodo, { input: createTodoInput }));
      onUpload();
    } catch (err) {
      console.log('problem with creating todo');
    }
  };

  return (
    <div className='newTodo'>
      <TextField
        label='Text'
        value={todoData.text}
        onChange={(ev) => setTodoData({ ...todoData, text: ev.target.value })}
      />
      <IconButton onClick={addTask}>
        <Add />
      </IconButton>
    </div>
  );
}
