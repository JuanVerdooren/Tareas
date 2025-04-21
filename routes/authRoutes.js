const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Obtener usuario autenticado
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const usuario = await User.findById(req.user.userId).select("username email role");
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo usuario", error });
    }
});

router.get("/all-users-tasks", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo los administradores pueden ver esta información." });
        }

        const usuariosConTareas = await User.find()
            .select("username email role")
            .lean();

        const tareas = await Task.find().populate("usuario", "username email").lean();

        // Asignar tareas a cada usuario
        const resultado = usuariosConTareas.map((usuario) => {
            return {
                ...usuario,
                tareas: tareas.filter(t => t.usuario && t.usuario._id.toString() === usuario._id.toString())
            };
        });

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los datos", error });
    }
});

// Registro de usuario (solo admin puede registrar)
router.post("/register", authMiddleware, async (req, res) => {
    try {
        // Verificar si el usuario autenticado es administrador
        if (req.user.role !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo los administradores pueden registrar usuarios." });
        }

        const { username, email, password, role } = req.body;

        let usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El usuario ya existe" });
        }

        // Permitir crear usuarios con rol específico, pero evitar que admin cree otros admin si no se desea
        const nuevoUsuario = new User({
            username,
            email,
            password,
            role: role || "user" // por defecto será 'user' si no se especifica
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
});


// Inicio de sesión
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const esPasswordCorrecto = await bcrypt.compare(password, usuario.password.trim());
        if (!esPasswordCorrecto) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        // Crear y enviar token con role incluido
        const payload = {
            userId: usuario._id,
            email: usuario.email,
            role: usuario.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            role: usuario.role
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error });
    }
});


// Ruta para obtener usuarios

router.get('/users', authMiddleware, async (req, res) => {
    try {
      const userRole = req.user.role;
  
      if (userRole === 'admin') {
        const users = await User.find({ role: 'user' });
        res.json(users);
      } else {
        res.status(403).json({ message: 'Acceso denegado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  });
  
  


// Obtener todos los usuarios (incluye la contraseña)
router.get("/users1", async (req, res) => {
    try {
      const usuarios = await User.find(); // Cambié Usuario por User
      res.json(usuarios);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  });

  router.delete('/users1/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Buscar y eliminar el usuario
      const user = await User.findByIdAndDelete(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor al eliminar el usuario' });
    }
  });
  
  router.put('/users1/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, email, password } = req.body;
  
      if (!username || !email) {
        return res.status(400).json({ message: 'Username y email son requeridos' });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar si el email ya está en uso por otro usuario
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
      }
  
      // Actualizar campos
      user.username = username;
      user.email = email;
  
      // Si se envió una nueva contraseña, actualizarla
      if (password && password.trim() !== "") {
        user.password = password; // Se hashea automáticamente en el modelo
      }
  
      await user.save();
  
      // Retornar el usuario actualizado (opcional: sin contraseña)
      const { password: _, ...userSinPassword } = user.toObject();
  
      res.status(200).json(userSinPassword);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error en el servidor al editar el usuario' });
    }
  });
  

  

module.exports = router;
