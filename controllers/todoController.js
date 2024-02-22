// controllers/todoController.js
import Todo from '../models/todo.js';
import User from '../models/userModel.js';

export const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    const user = await User.findById(todo.createdBy);
    todo.createdBy = user.name?user.name:''
    res.status(200).json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPrivateTodosByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const privateTodos = await Todo.find({ createdBy: userId, isPublic: false });
      privateTodos.forEach(e => {
        e.percentage = (e.percentage / 100).toFixed(2)
      });
      res.status(200).json(privateTodos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  export const getPublicTodos = async (req, res) => {
    try {
      const publicTodos = await Todo.find({ isPublic: true });
      publicTodos.map(e => {
        const percent = e.percentage/100;
        e.percentage =percent ==0? 0.00: percent.toFixed(2);
        console.log(e.percentage);
      });
      console.log(publicTodos);
      res.status(200).json(publicTodos);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
// You can add more controller methods as needed
