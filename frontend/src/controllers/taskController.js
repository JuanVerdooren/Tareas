const Task = require("../models/Task");

// Obtener todas las tareas del usuario autenticado
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ usuario: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo las tareas", error });
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    try {
        const { titulo, descripcion, fecha, prioridad, categoria } = req.body;
        const nuevaTarea = new Task({
            titulo,
            descripcion,
            fecha,
            prioridad,
            categoria,
            usuario: req.user.id,
        });

        await nuevaTarea.save();
        res.status(201).json(nuevaTarea);
    } catch (error) {
        res.status(500).json({ mensaje: "Error guardando la tarea", error });
    }
};

// Actualizar una tarea existente
const updateTask = async (req, res) => {
    try {
        const tarea = await Task.findById(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

        // Verificar si el usuario es el dueño de la tarea
        if (tarea.usuario.toString() !== req.user.id) {
            return res.status(401).json({ mensaje: "No autorizado" });
        }

        const tareaActualizada = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tareaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error actualizando la tarea", error });
    }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
    try {
        const tarea = await Task.findById(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: "Tarea no encontrada" });

        // Verificar si el usuario es el dueño de la tarea
        if (tarea.usuario.toString() !== req.user.id) {
            return res.status(401).json({ mensaje: "No autorizado" });
        }

        await tarea.deleteOne();
        res.json({ mensaje: "Tarea eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error eliminando la tarea", error });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
