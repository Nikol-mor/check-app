import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listTodos } from '../graphql/queries';
import { updateTodo, deleteTodo } from '../graphql/mutations';
import { useEffect, useState } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import { Delete, Edit, Add } from '@material-ui/icons';
import { AddTodo } from './AddTodo';
import { EditTodo } from './EditTodo';

export function TodoList({ loggedInId }) {
  const [todos, setTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // let filter={
  //   ownerId: loggedInId
  // }
  // { filter: { ownerId: loggedInId }

  const fetchTodos = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user toodList', user.username);
      console.log('user toodList', user.attributes.sub);
      let filterby = { ownerId: { contains: user.attributes.sub } };
      console.log('filterby', filterby);
      // const todoData = await API.graphql(graphqlOperation(listTodos));
      const todoData = await API.graphql(graphqlOperation(listTodos, { filter: filterby }));
      const todoList = todoData.data.listTodos.items;
      console.log('todo list', todoList);
      setTodos(todoList);
    } catch (error) {
      console.log('error on fetching todos', error);
    }
    // try {
    //   const user = await Auth.currentAuthenticatedUser();
    //   const todoData = await API.graphql(graphqlOperation(listTodos));
    //   const todoList = todoData.data.listTodos.items;
    //   console.log('user: ', user);
    //   // console.log('todo list', todoList);
    //   setTodos(todoList);
    // } catch (error) {
    //   console.log('error on fetching todos', error);
    // }
  };

  const onDelete = async (idx) => {
    try {
      console.log('entered delete');
      console.log('todos', todos);
      const todo = todos[idx];
      console.log('todo', todo, ' in idx: ', idx);
      const todoData = await API.graphql(graphqlOperation(deleteTodo, { input: { id: todo.id } }));
      fetchTodos();
    } catch (error) {
      console.log('error on deleting todo', error);
    }
  };

  // const onEdit = async (idx) => {
  //   try {
  //     const todo = todos[idx];
  //     todo.description = 'i am new';
  //     delete todo.createdAt;
  //     delete todo.updatedAt;

  //     const todoData = await API.graphql(graphqlOperation(updateTodo, { input: todo }));
  //     const todoList = [...todos];
  //     todoList[idx] = todoData.data.updateTodo;
  //     setTodos(todoList);
  //   } catch (error) {
  //     console.log('error on deleting todo', error);
  //   }
  // };

  const onToggleTodo = async (todo) => {
    // console.log('todo we got in edit comp', todo);
    // console.log('todoData after input ', todoData);
    let newValue = todo.isdone ? false : true;
    try {
      await API.graphql(graphqlOperation(updateTodo, { input: { id: todo.id, isdone: newValue } }));
      fetchTodos();
    } catch (err) {
      console.log('problem with checking todo');
    }
  };

  return (
    <div className='todo-list'>
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
      {showEditTodo ? (
        <EditTodo todo={todoToEdit} fetchTodos={fetchTodos} setShowEditTodo={setShowEditTodo} />
      ) : (
        ''
      )}
      {todos.map((todo, idx) => {
        return (
          <Paper variant='outlined' elevation={2} key={`todo${idx}`}>
            <div className='todo-card flex align-center'>
              <div className='todo-actions'>
                <IconButton aria-label='delete-btn' onClick={() => onDelete(idx)}>
                  <Delete />
                </IconButton>
                <IconButton
                  aria-label='edit-btn'
                  onClick={() => {
                    // setShowEditTodo(true);
                    setShowEditTodo(true);
                    setTodoToEdit(todo);
                    // onEdit(idx);
                  }}>
                  <Edit />
                </IconButton>
              </div>
              <div className={todo.isdone ? 'strike-through' : ''}>{todo.text}</div>
              <input
                type='checkbox'
                id={todo.id}
                checked={todo.isdone}
                onChange={() => onToggleTodo(todo)}
              />
            </div>
          </Paper>
        );
      })}
    </div>
  );
}
