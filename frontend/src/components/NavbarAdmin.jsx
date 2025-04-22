import { useState, useEffect } from "react";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/NavbarAdmin.css";
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-..." crossorigin="anonymous"></script>


const NavbarAdmin = () => {
  const { token, logout } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5001/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsername(data.username))
      .catch(() => Swal.fire("Error", "No se pudo obtener el usuario", "error"));
  }, [token, navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-admin mb-4">
      <div className="container-fluid">
        <div className="d-flex align-items-center text-white gap-2">
          <FaUserCircle size={24} />

          <strong className="username"> Hola, {username}</strong>
        </div>

    
        <button
          className="navbar-toggler text-white border-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdminCollapse"
          aria-controls="navbarAdminCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarAdminCollapse">
          <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
            <Link to="/admin/tareas" className="btn btn-outline-light btn-sm">Tareas</Link>
            <Link to="/admin/users" className="btn btn-outline-light btn-sm">Usuarios</Link>
            <Link to="/register" className="btn btn-outline-light btn-sm">Registrar Usuario</Link>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-1"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
