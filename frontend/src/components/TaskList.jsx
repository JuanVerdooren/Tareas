import "../styles/TaskList.css";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const TaskList = ({ tasks, handleEdit, handleDelete, toggleEstado, isAdmin }) => {
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <div className="row">
      {tasks.length === 0 ? (
        <div className="text-center text-muted py-5">
          No hay tareas registradas
        </div>
      ) : (
        tasks.map((task) => {
          const isExpanded = expandedTasks[task._id];
          const longDesc = task.descripcion && task.descripcion.length > 150;

          return (
            <div className="col-12 mb-4" key={task._id}>
              <div className="task-card p-4 shadow-sm scale-in">
                <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                  <h4 className="task-title text-break flex-grow-1 me-2">
                    {task.titulo}
                  </h4>
                  <span
                    className={`badge fs-6 ${
                      task.prioridad === "Alta"
                        ? "bg-danger"
                        : task.prioridad === "Media"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {task.prioridad}
                  </span>
                </div>

                <div className="mb-3">
                  <strong>Descripción:</strong>{" "}
                  <span className="task-desc">
                    {isExpanded || !longDesc
                      ? task.descripcion
                      : `${task.descripcion.slice(0, 150)}... `}
                    {longDesc && (
                      <button
                        className=" btn btn-link btn-sm p-0 ms-1"
                        onClick={() => toggleExpand(task._id)}
                      >
                        {isExpanded ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </span>
                </div>

                <p className="text-muted mb-1">
                  <strong>Fecha límite:</strong>{" "}
                  {task.fecha
                    ? new Date(task.fecha).toLocaleDateString()
                    : "Sin fecha"}
                </p>
                <p className="text-muted mb-1">
                  <strong>Categoría:</strong> {task.categoria}
                </p>

                {isAdmin && task.usuario && (
                  <p className="text-muted mb-3">
                    <strong>Asignado a:</strong> {task.usuario.username} ({task.usuario.email})
                  </p>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <button
                    onClick={() => toggleEstado(task._id, task.estado)}
                    className={`btn fw-bold ${
                      task.estado
                        ? "btn-outline-success"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {task.estado ? "✔ Completado" : "⏳ Pendiente"}
                  </button>

                  <div className="d-flex gap-2">
                    {isAdmin && (
                      <>
                        <button
                          className="icon-btn1"
                          onClick={() => handleEdit(task)}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleDelete(task._id)}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;
