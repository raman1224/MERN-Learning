import mongoose, { Schema } from 'mongoose';
import { ITodo } from '../types/index.js';

const todoSchema = new Schema<ITodo>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<ITodo>('Todo', todoSchema);