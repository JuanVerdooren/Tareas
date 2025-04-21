import { useEffect, useState, useCallback } from "react";
import TaskList from "../components/TaskList";
import Swal from "sweetalert2";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  


  const token = localStorage.getItem("token");
  const API_URL = "http://localhost:5001/tasks";

  // Cargar usuario y tareas al inicio
  const fetchTasks = useCallback(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error cargando tareas:", err));
  }, [token]);

  // Cargar usuario y tareas al inicio
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5001/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
      })
      .catch(() =>
        Swal.fire("Error", "No se pudo obtener el usuario", "error")
      );

    fetchTasks();
  }, [token, fetchTasks]);


 

  // Cambiar estado de la tarea
  const toggleEstado = async (id, estadoActual) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: !estadoActual }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="d-flex align-items-center gap-2">
          <FaUserCircle size={30}/>
          <span className="fw-semibold">Hola, {username}</span>
        </h4>

        <button
          className="btn btn-danger d-flex align-items-center gap-2 fw-bold"
          onClick={handleLogout}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Cerrar sesión"
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>
      </div>

      

      <TaskList
        tasks={tasks}
        toggleEstado={toggleEstado}
      />
    </div>
  );
};

export default Dashboard;
