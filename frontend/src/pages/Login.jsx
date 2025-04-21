import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "animate.css";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const MySwal = withReactContent(Swal);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Credenciales inválidas");

      localStorage.setItem("token", data.token);

      MySwal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Has iniciado sesión correctamente",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      MySwal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: err.message,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-body-secondary text-body">
      <form
        onSubmit={handleSubmit}
        className="p-4 p-md-5 rounded-4 shadow-lg animate__animated animate__fadeIn bg-white bg-opacity-75"
        style={{
          maxWidth: "420px",
          width: "100%",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="text-center mb-4">
          <FaSignInAlt size={42} className="text-primary mb-2" />
          <h3 className="fw-bold">Accede a tu cuenta</h3>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control shadow-sm"
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="position-absolute top-50 translate-middle-y"
              style={{
                right: "15px",
                cursor: "pointer",
                zIndex: 10,
              }}
              title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold py-2 d-flex justify-content-center align-items-center gap-2"
        >
          <FaSignInAlt />
          Iniciar Sesión
        </button>
        
      </form>
    </div>
  );
};

export default Login;
