import React, { useState } from 'react';
import type { Todo } from '../types';
import { useTodos } from '../hooks/useTodos';
import toast from 'react-hot-toast';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(todo.title);
  const [editDescription, setEditDescription] = useState<string>(todo.description || '');

  const handleToggleComplete = async () => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed }).unwrap();
      toast.success(todo.completed ? 'Task marked as pending' : 'Task completed!');
    } catch (err: any) {
      toast.error('Failed to update todo');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(todo._id).unwrap();
        toast.success('Todo deleted');
      } catch (err: any) {
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    try {
      await updateTodo(todo._id, {
        title: editTitle,
        description: editDescription
      }).unwrap();
      setIsEditing(false);
      toast.success('Todo updated');
    } catch (err: any) {
      toast.error('Failed to update todo');
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-2"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
          rows={2}
        />
        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-md ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <h3 className={`ml-3 text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
          </div>
          {todo.description && (
            <p className={`mt-2 ml-8 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <div className="mt-2 ml-8 text-xs text-gray-400">
            Created: {new Date(todo.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;