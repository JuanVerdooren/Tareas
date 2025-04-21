const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, },
    fecha: { type: Date },
    prioridad: { type: String,},
    categoria: { type: String, },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    estado: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);