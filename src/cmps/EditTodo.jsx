import { API, graphqlOperation } from 'aws-amplify';
import { createTodo } from '../graphql/mutations';
import { useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { v4 as uuid } from 'uuid';

export function EditTodo({ todo }) {
  const [todoText, setTodoText] = useState('');

  //   const EditTask = async () => {
  //     console.log('todoData', todoData);
  //     const { text } = todoData;

  //     const createTodoInput = {
  //       // id: uuid(),
  //       text,
  //       isdone: false,
  //     };
  //     try {
  //       await API.graphql(graphqlOperation(createTodo, { input: createTodoInput }));
  //       onUpload();
  //     } catch (err) {
  //       console.log('problem with editing todo');
  //     }
  //   };

  return (
    <div>
      <h1>Edit</h1>
      <h2>todo.text</h2>
      {/* <TextField
        label='Text'
        value={todoData.text}
        onChange={(ev) => setTodoData({ ...todoData, text: ev.target.value })}
      /> */}
      {/* <TextField
        label='Text'
        value={todoData.text}
        onChange={(ev) => setTodoData({ ...todoData, text: ev.target.value })}
      />
      <IconButton onClick={addTask}>
        <Add />
      </IconButton> */}
    </div>
  );
}
