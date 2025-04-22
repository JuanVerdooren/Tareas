import React, { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaSave,
  FaStickyNote,
  FaCalendarAlt,
  FaFlag,
  FaLayerGroup,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/TaskForm.css";


const TaskForm = ({ handleSubmit, formData, setFormData, editingTaskId }) => {
  const { titulo, descripcion, fecha, prioridad, categoria, usuario } = formData;
  const [error, setError] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const { token, user: usuarioLogueado } = useAuth();

  useEffect(() => {
    if (usuarioLogueado && usuarioLogueado.role === "admin") {
      const cargarUsuarios = async () => {
        try {
          const response = await fetch("http://localhost:5001/auth/users", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("No se pudo obtener los usuarios");
          }

          const data = await response.json();

          if (Array.isArray(data)) {
            setUsuarios(data); 
          }
        } catch (error) {
          console.error("Error al obtener usuarios:", error);
        }
      };

      cargarUsuarios();
    }
  }, [usuarioLogueado, token]);

  useEffect(() => {
    if (editingTaskId && formData._id) {
      setFormData({
        titulo: formData.titulo || "",
        descripcion: formData.descripcion || "",
        fecha: formData.fecha || "",
        prioridad: formData.prioridad || "",
        categoria: formData.categoria || "",
        usuario: formData.usuario || "",
      });
    }
  }, [editingTaskId, formData, setFormData]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleLocalSubmit} className="task-form mb-5">

      <h4 className="text-center mb-4 fw-bold">
        {editingTaskId ? "Editar tarea" : "Agregar nueva tarea"}
      </h4>

      {error && (
        <div className="alert alert-danger text-center fw-bold">{error}</div>
      )}

      <div className="row g-4 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <FaStickyNote className="me-2 text-secondary" />
            Título <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Escribe el título de la tarea"
            value={titulo}
            onChange={(e) =>
              setFormData({ ...formData, titulo: e.target.value })
            }
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            <FaStickyNote className="me-2 text-secondary" />
            Descripción
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Descripción breve de la tarea"
            value={descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />
        </div>
      </div>

      <div className="row g-4 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">
            <FaCalendarAlt className="me-2 text-secondary" />
            Fecha límite
          </label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">
            <FaFlag className="me-2 text-secondary" />
            Prioridad
          </label>
          <select
            className="form-select"
            value={prioridad}
            onChange={(e) =>
              setFormData({ ...formData, prioridad: e.target.value })
            }
          >
            <option value="">Selecciona prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">
            <FaLayerGroup className="me-2 text-secondary" />
            Categoría
          </label>
          <select
            className="form-select"
            value={categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
          >
            <option value="">Selecciona categoría</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Personal">Personal</option>
            <option value="Estudio">Estudio</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="usuario" className="form-label fw-semibold">
          <FaUser className="me-2 text-secondary" />
          Asignar a usuario <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          id="usuario"
          name="usuario"
          value={usuario}
          onChange={(e) =>
            setFormData({ ...formData, usuario: e.target.value })
          }
          
        >
          <option value="">Seleccionar usuario</option>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <option key={usuario._id} value={usuario._id}>
                {usuario.username}
              </option>
            ))
          ) : (
            <option disabled value="">
              No hay usuarios disponibles
            </option>
          )}
        </select>
      </div>

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={editingTaskId ? "Guardar cambios" : "Agregar tarea"}
        >
          {editingTaskId ? <FaSave /> : <FaPlusCircle />}
          {editingTaskId ? "Actualizar Tarea" : "Agregar Tarea"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
