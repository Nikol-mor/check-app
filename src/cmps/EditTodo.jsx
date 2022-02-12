import { API, graphqlOperation } from 'aws-amplify';
import { updateTodo } from '../graphql/mutations';
import { useState, useRef, useEffect } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { v4 as uuid } from 'uuid';
import { Save } from '@material-ui/icons';

export function EditTodo({ todo, fetchTodos, setShowEditTodo }) {
  const [todoData, setTodoData] = useState({});

  //   const textRef = useRef();

  //   const showRefContent = () => {
  //     console.log(textRef.current.value);
  //   };

  const editTask = async (ev) => {
    console.log('todo we got in edit comp', todo);
    console.log('todoData after input ', todoData);
    try {
      await API.graphql(
        graphqlOperation(updateTodo, { input: { id: todo.id, text: todoData.text } })
      );
      fetchTodos();
    } catch (err) {
      console.log('problem with editing todo');
    }
    setShowEditTodo(false);
  };

  return (
    <section className='hero-main'>
      <div className='edit-todo'>
        <h1>Edit</h1>
        <h2>{todo.text}</h2>
        <TextField
          label='Text'
          // inputRef={textRef}
          value={todoData.text}
          onChange={(ev) => setTodoData({ ...todoData, text: ev.target.value })}
        />
        <IconButton onClick={editTask}>
          <Save />
        </IconButton>
      </div>
    </section>
  );
}
