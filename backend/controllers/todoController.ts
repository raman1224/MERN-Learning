import { Response } from 'express';
import mongoose from 'mongoose';
import Todo from '../models/Todo.js';
import { AuthRequest, TodoBody } from '../types/index.js';

// @desc    Get all todos for user
// @route   GET /api/todos
export const getTodos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create todo
// @route   POST /api/todos
export const createTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body as TodoBody;
    
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    
    if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const todo = await Todo.create({
      user: req.user._id,
      title,
      description: description || ''
    });
    
    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
export const updateTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }
    
    const todo = await Todo.findById(id);
    
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    
    if (todo.user.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
export const deleteTodo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid todo ID' });
      return;
    }
    
    const todo = await Todo.findById(id);
    
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }
    
    if (todo.user.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    await todo.deleteOne();
    res.json({ message: 'Todo removed successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};