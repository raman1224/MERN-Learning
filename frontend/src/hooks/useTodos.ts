import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../features/todos/todoSlice';
import { Todo } from '../types';

export const useTodos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading, error } = useSelector((state: RootState) => state.todos);

  const handleFetchTodos = () => {
    return dispatch(fetchTodos());
  };

  const handleCreateTodo = (title: string, description?: string) => {
    return dispatch(createTodo({ title, description }));
  };

  const handleUpdateTodo = (id: string, updates: Partial<Todo>) => {
    return dispatch(updateTodo({ id, updates }));
  };

  const handleDeleteTodo = (id: string) => {
    return dispatch(deleteTodo(id));
  };

  return {
    todos,
    isLoading,
    error,
    fetchTodos: handleFetchTodos,
    createTodo: handleCreateTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
  };
};