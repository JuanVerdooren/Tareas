import React from "react";

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
  const { _id, titulo, descripcion, fecha, prioridad, categoria, estado } = task;

  return (
    <tr
      id={_id}
      className={`align-middle animate__animated animate__fadeIn ${estado ? "table-success" : ""}`}
    >
      <td>{titulo}</td>
      <td>{descripcion}</td>
      <td>{new Date(fecha).toLocaleDateString()}</td>
      <td>
        <span className={`badge 
          ${prioridad === "Alta" ? "bg-danger" : 
            prioridad === "Media" ? "bg-warning text-dark" : 
            "bg-success"}`}>
          {prioridad}
        </span>
      </td>
      <td>{categoria}</td>
      <td className="text-center">
        <button
          className={`btn btn-sm fw-bold shadow-sm 
            ${estado ? "btn-outline-success" : "btn-outline-secondary"}`}
          onClick={() => onToggle(_id, estado)}
        >
          {estado ? "✔ Completado" : "⏳ Pendiente"}
        </button>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => onEdit(task)}
          >
            ✏ Editar
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(_id)}
          >
            🗑 Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;
