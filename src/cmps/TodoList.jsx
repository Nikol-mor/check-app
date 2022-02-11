import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listTodos } from '../graphql/queries';
import { updateTodo, deleteTodo } from '../graphql/mutations';
import { useEffect, useState } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import { Delete, Edit, Add } from '@material-ui/icons';
import { AddTodo } from './AddTodo';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todoList = todoData.data.listTodos.items;
      const user = await Auth.currentAuthenticatedUser();
      console.log('user: ', user);
      console.log('user info: ', user.signInUserSession.idToken.payload);
      console.log('todo list', todoList);
      setTodos(todoList);
    } catch (error) {
      console.log('error on fetching todos', error);
    }
  };

  const onDelete = async (idx) => {
    try {
      console.log('entered delete');
      const todo = todos[idx];
      const todoData = await API.graphql(graphqlOperation(deleteTodo, { input: todo }));
      //   const todoList = [...todos];
      //   todoList[idx] = todoData.data.deleteTodo;
      setTodos({ todos: todoData.data.listTodos.items });
    } catch (error) {
      console.log('error on deleting todo', error);
    }
  };

  const onEdit = async (idx) => {
    try {
      const todo = todos[idx];
      todo.description = 'i am new';
      delete todo.createdAt;
      delete todo.updatedAt;

      const todoData = await API.graphql(graphqlOperation(updateTodo, { input: todo }));
      const todoList = [...todos];
      todoList[idx] = todoData.data.updateTodo;
      setTodos(todoList);
    } catch (error) {
      console.log('error on deleting todo', error);
    }
  };

  return (
    <div className='todoList'>
      {todos.map((todo, idx) => {
        return (
          <Paper variant='outlined' elevation={2} key={`todo${idx}`}>
            <div className='todoCard'>
              <IconButton aria-label='delete-btn' onClick={() => onDelete(idx)}>
                <Delete />
              </IconButton>
              <IconButton aria-label='edit-btn' onClick={() => onEdit(idx)}>
                <Edit />
              </IconButton>
              <div>
                <div className='todoName'>{todo.text}</div>
              </div>
            </div>
          </Paper>
        );
      })}
      {showAddTodo ? (
        <AddTodo
          onUpload={() => {
            setShowAddTodo(false);
            fetchTodos();
          }}
        />
      ) : (
        <IconButton onClick={() => setShowAddTodo(true)}>
          <Add />
        </IconButton>
      )}
    </div>
  );
}
