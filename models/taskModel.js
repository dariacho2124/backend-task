// models/taskModel.js
const mongoose = require("mongoose");

// Definición del esquema de tarea
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // El título es obligatorio
  },
  description: {
    type: String,
    required: false, // La descripción es opcional
  },
  completed: {
    type: Boolean,
    default: false, // El estado por defecto es false
  },
  createdAt: {
    type: Date,
    default: Date.now, // La fecha de creación se genera automáticamente
  },
});

// Creamos el modelo a partir del esquema
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
