import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listTodos } from '../graphql/queries';
import { updateTodo, deleteTodo } from '../graphql/mutations';
import { useEffect, useState } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import { Delete, Edit, Add } from '@material-ui/icons';
import { AddTodo } from './AddTodo';
import { EditTodo } from './EditTodo';

export function TodoList() {
  const [todos, setTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const [doneTodos, setDoneTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      let filterby = { ownerId: { contains: user.attributes.sub } };
      const todoData = await API.graphql(graphqlOperation(listTodos, { filter: filterby }));
      const todoList = todoData.data.listTodos.items;
      setTodos(todoList);

      let filterDone = { ownerId: { contains: user.attributes.sub }, isdone: { eq: true } };
      const doneTodoData = await API.graphql(graphqlOperation(listTodos, { filter: filterDone }));
      setDoneTodos(doneTodoData.data.listTodos.items);
    } catch (error) {
      console.log('error on fetching todos', error);
    }
  };

  const onDelete = async (idx) => {
    try {
      const todo = todos[idx];
      const todoData = await API.graphql(graphqlOperation(deleteTodo, { input: { id: todo.id } }));
      fetchTodos();
    } catch (error) {
      console.log('error on deleting todo', error);
    }
  };

  const onToggleTodo = async (todo) => {
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
      <div className='progress-bar-container' style={{ width: '300px', height: '30px' }}>
        <div
          className='progress-bar'
          style={{ height: '100%', width: (doneTodos.length / todos.length) * 100 + '%' }}>
          <span>{doneTodos.length + '/' + todos.length} Done</span>
        </div>
      </div>

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
                    setShowEditTodo(true);
                    setTodoToEdit(todo);
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
