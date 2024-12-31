const express = require("express");
const Task = require("../models/Task");
const { validationResult, body } = require("express-validator");
const router = express.Router(); // Aquí definimos el router

//Aqui se implemento la validacion de express-validator al igual que en put
router.post(
  "/",
  [
    body("title")
      .notEmpty()
      .withMessage("El título es obligatorio")
      .isLength({ min: 5 })
      .withMessage("El título debe tener al menos 5 caracteres"),
    body("description")
      .optional()
      .isLength({ min: 10 })
      .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("completed")
      .isBoolean()
      .withMessage("El campo completed debe ser un valor booleano"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, completed } = req.body;
    try {
      const newTask = new Task({ title, description, completed });
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la tarea", error });
    }
  }
);

router.get("/", async (req, res) => {
  const { status } = req.query;
  
  try {
    let tasks;

    if (status === "completed" || status === "pending") {
      const completed = status === "completed"; 
      tasks = await Task.find({ completed });
    } else {
      tasks = await Task.find();
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put(
  "/:id",
  [
    body("title")
      .optional()
      .isLength({ min: 5 })
      .withMessage("El título debe tener al menos 5 caracteres"),
    body("description")
      .optional()
      .isLength({ min: 10 })
      .withMessage("La descripción debe tener al menos 10 caracteres"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("El campo completed debe ser un valor booleano"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, completed } = req.body;
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, completed },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
