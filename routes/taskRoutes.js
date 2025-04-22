const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Obtener tareas
router.get("/", authMiddleware, async (req, res) => {
    try {
        const isAdmin = req.user.role === "admin";
        const filter = isAdmin ? {} : { usuario: req.user.userId };
        const tasks = await Task.find(filter).populate("usuario", "username email");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
});


// Crear nueva tarea (solo admin puede asignar tareas)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { titulo, descripcion, fecha, prioridad, categoria, usuario } = req.body;

        if (!titulo) {
            return res.status(400).json({ mensaje: "El título es obligatorio" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ mensaje: "Solo los administradores pueden crear tareas" });
        }

        const nuevaTask = new Task({
            titulo,
            descripcion: descripcion || "",
            fecha: fecha || null,
            prioridad: prioridad || "",
            categoria: categoria || "",
            usuario,
        });

        await nuevaTask.save();
        res.status(201).json(nuevaTask);
    } catch (error) {
        res.status(500).json({ mensaje: "Error guardando la tarea", error });
    }
});

// Actualizar tarea (admin)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha, prioridad, categoria, usuario } = req.body;
        const userId = req.user.userId;

        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        const isOwner = task.usuario.toString() === userId;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ mensaje: "No autorizado para editar esta tarea" });
        }

        task.titulo = titulo || task.titulo;
        task.descripcion = descripcion || task.descripcion;
        task.fecha = fecha || task.fecha;
        task.prioridad = prioridad || task.prioridad;
        task.categoria = categoria || task.categoria;

        if (isAdmin && usuario) {
            task.usuario = usuario;
        }

        await task.save();
        res.json({ mensaje: "Tarea actualizada con éxito", task });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar la tarea", error });
    }
});

// Eliminar tarea (admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.userId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        const isOwner = task.usuario.toString() === userId;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ mensaje: "No autorizado para eliminar esta tarea" });
        }

        await task.deleteOne();
        res.json({ mensaje: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error eliminando la tarea", error });
    }
});

// Cambiar estado de una tarea (completado/pendiente)
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const { estado } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        const isOwner = task.usuario.toString() === req.user.userId;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ mensaje: "No autorizado para modificar esta tarea" });
        }

        task.estado = estado;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

// Obtener nombre de usuario autenticado
router.get("/auth/user", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ mensaje: "No autorizado" });

        const decoded = jwt.verify(token, "secreto");
        const user = await User.findById(decoded.userId).select("username");

        if (!user) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        res.json({ username: user.username });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

module.exports = router;
