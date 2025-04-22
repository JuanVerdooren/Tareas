import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "animate.css";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import NavbarAdmin from "../components/NavbarAdmin";
import "../styles/Register.css"; 

const MySwal = withReactContent(Swal);

const Register = () => {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token || user?.role !== "admin") {
      return MySwal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Solo los administradores pueden registrar nuevos usuarios",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  
    try {
      const res = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "El usuario ya existe.");
  
      MySwal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Usuario creado correctamente",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
  
      // ✅ Limpiar formulario
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      setShowPassword(false); // También oculta la contraseña si estaba visible
  
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Error al registrar",
        text: err.message,
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    }
  };
  

  return (
    <div className="container">
      <NavbarAdmin />
      <div className="register-page-wrapper my-5">
        <form onSubmit={handleSubmit} className="register-form shadow-lg animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <FaUserPlus size={42} className="text-primary mb-2" />
            <h3 className="fw-bold">Registrar nuevo usuario</h3>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre completo</label>
            <input
              type="text"
              name="username"
              className="form-control shadow-sm"
              placeholder="Tu nombre"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Correo electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control shadow-sm"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control shadow-sm pe-5"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute top-50 translate-middle-y eye-icon"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="mb-4">
              <label className="form-label fw-semibold">Rol del nuevo usuario</label>
              <select
                name="role"
                className="form-select shadow-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2 d-flex justify-content-center align-items-center gap-2"
          >
            <FaUserPlus />
            Registrar usuario
          </button>

         
        </form>
      </div>
    </div>
  );
};

export default Register;
