// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Task = require("../models/Task");

// Obtener todos los usuarios con sus tareas (solo admin)
router.get("/users-tasks", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    // Buscar todos los usuarios y sus tareas asociadas
    const usuarios = await User.find().select("-password"); // sin password

    // Buscar todas las tareas y agrupar por usuario
    const tareas = await Task.find().populate("usuario", "username email");

    // Agrupar tareas por usuarioId
    const tareasPorUsuario = {};
    tareas.forEach((tarea) => {
      const userId = tarea.usuario._id;
      if (!tareasPorUsuario[userId]) {
        tareasPorUsuario[userId] = [];
      }
      tareasPorUsuario[userId].push(tarea);
    });

    // Combinar usuarios con sus tareas
    const resultado = usuarios.map((usuario) => ({
      ...usuario.toObject(),
      tareas: tareasPorUsuario[usuario._id] || [],
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo tareas", error });
  }
});

module.exports = router;
