import { API, graphqlOperation } from 'aws-amplify';
import { createTodo } from '../graphql/mutations';
import { useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { v4 as uuid } from 'uuid';

export function AddTodo({ onUpload }) {
  const [todoData, setTodoData] = useState({});

  const addTask = async () => {
    console.log('todoData', todoData);
    const { text } = todoData;

    const createTodoInput = {
      // id: uuid(),
      text,
      isdone: false,
    };
    try {
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
      {/* <TextField
        label='Description'
        value={todoData.description}
        onChange={(ev) => setTodoData({ ...todoData, description: ev.target.value })}
      /> */}
      <IconButton onClick={addTask}>
        <Add />
      </IconButton>
    </div>
  );
}
