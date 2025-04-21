// src/pages/AdminTareas.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import NavbarAdmin from "../components/NavbarAdmin";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";


const AdminTareas = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]); // Aseguramos que tasks siempre sea un arreglo
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "",
    categoria: "",
    usuario: "",
  });
  const formRef = useRef(null);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const API_URL = "http://localhost:5001";

  // Función para obtener las tareas usando fetch
  const fetchTasks = useCallback(async () => {
    if (!token) {
      console.error("Token no disponible. El usuario no está autenticado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Validamos si la respuesta es un arreglo
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Error: La respuesta no es un arreglo.");
          setTasks([]); // Si la respuesta no es un arreglo, dejamos tasks vacío
        }
      } else {
        console.error("Error al obtener tareas:", response.statusText);
      }
    } catch (err) {
      console.error("Error al obtener tareas", err);
    }
  }, [token]);

  // Función para obtener los usuarios usando fetch
  const fetchUsuarios = useCallback(async () => {
    if (!token) {
      console.error("Token no disponible. El usuario no está autenticado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error("Error al obtener usuarios:", response.statusText);
      }
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  }, [token]);

  // Cargar tareas y usuarios al montar el componente
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUsuarios();
    } else {
      console.error("Token no disponible.");
    }
  }, [fetchTasks, fetchUsuarios, token]);

  // Función para manejar el envío del formulario (crear o editar tarea)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.usuario) {
      Swal.fire("Error", "Debes seleccionar un usuario para asignar la tarea", "error");
      return;
    }

    try {
      const method = editingTaskId ? "PUT" : "POST";
      const url = editingTaskId
        ? `${API_URL}/tasks/${editingTaskId}`
        : `${API_URL}/tasks`;

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {

        const message = editingTaskId ? "Tarea actualizada" : "Tarea creada";
        Swal.fire(message, `Tarea ${message.toLowerCase()} correctamente`, "success");
        // Resetear el formulario y recargar las tareas
        setFormData({
          titulo: "",
          descripcion: "",
          fecha: "",
          prioridad: "",
          categoria: "",
          usuario: "",
        });
        setEditingTaskId(null);
        fetchTasks();
      } else {
        Swal.fire("Error", "No se pudo guardar la tarea", "error");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo guardar la tarea", "error");
    }
  };

  // Función para editar tarea
  const handleEdit = (task) => {
    setFormData({
      titulo: task.titulo,
      descripcion: task.descripcion,
      fecha: task.fecha?.split("T")[0] || "",
      prioridad: task.prioridad,
      categoria: task.categoria,
      usuario: task.usuario?._id || "",
    });
    setEditingTaskId(task._id);

    formRef.current?.scrollIntoView({ behavior: "smooth" });

  };

  // Función para eliminar tarea
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás segura?",
      text: "No podrás deshacer esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          fetchTasks();
          Swal.fire("Eliminada", "La tarea ha sido eliminada", "success");
        } else {
          Swal.fire("Error", "No se pudo eliminar la tarea", "error");
        }
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar la tarea", "error");
      }
    }
  };

  // Función para cambiar el estado de la tarea (completada/no completada)
  const toggleEstado = async (id, estadoActual) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: !estadoActual }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        console.error("Error al cambiar estado", response.statusText);
      }
    } catch (err) {
      console.error("Error al cambiar estado", err);
    }
  };

  return (
    <div className="container ">
              <NavbarAdmin />
      <div className="container my-5" ref={formRef}> 
        <TaskForm
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingTaskId={editingTaskId}
          usuarios={usuarios}
        />
        <TaskList
          tasks={Array.isArray(tasks) ? tasks : []}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          toggleEstado={toggleEstado}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default AdminTareas;
