const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization");


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado o mal formado." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role, 
        };
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
};

