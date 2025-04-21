const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ mensaje: "El usuario ya existe" });

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        user = new User({ nombre, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el registro", error });
    }
};

// Iniciar sesión
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario en la base de datos
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ mensaje: "Credenciales incorrectas" });

        // Generar token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email } });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el inicio de sesión", error });
    }
};

// Obtener usuario autenticado
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ mensaje: "Error obteniendo el usuario", error });
    }
};

module.exports = { registerUser, loginUser, getUser };
