import { API, graphqlOperation } from 'aws-amplify';
import { updateTodo } from '../graphql/mutations';
import { useState } from 'react';
import { IconButton, TextField } from '@material-ui/core';
import { Save } from '@material-ui/icons';

export function EditTodo({ todo, fetchTodos, setShowEditTodo }) {
  const [todoData, setTodoData] = useState({});

  const editTask = async (ev) => {
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
        <h1>Edit Todo</h1>
        <TextField
          label={todo.text}
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
