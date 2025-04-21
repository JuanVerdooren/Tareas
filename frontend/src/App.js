import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminTareas from "./pages/AdminTareas";
import AdminUsers from "./pages/AdminUsers";
import { AuthProvider, useAuth } from "./context/AuthContext";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const AppRoutes = () => {
  const { token, role, loading } = useAuth();

  // Si aún estamos cargando la información del usuario, no renderizamos nada
  if (loading) return null;

  return (
    <Routes>
      {/* Ruta raíz, redirige según el token y el rol */}
      <Route
        path="/"
        element={
          !token
            ? <Login />
            : role === "admin"
              ? <Navigate to="/admin/tareas" />
              : <Navigate to="/dashboard" />
        }
      />
      
      {/* Rutas para admin */}
      <Route
        path="/admin/tareas"
        element={token && role === "admin" ? <AdminTareas /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/users"
        element={token && role === "admin" ? <AdminUsers /> : <Navigate to="/" />}
      />

      {/* Ruta de registro, solo accesible si el usuario no está logueado y es admin */}
      <Route
        path="/register"
        element={token && role === "admin" ? <Register /> : <Navigate to="/login" />}
      />
      
      {/* Rutas para usuario logueado */}
      <Route
        path="/dashboard"
        element={token && role === "user" ? <Dashboard /> : <Navigate to="/" />}
      />

      {/* Ruta de login, solo accesible si el usuario no está logueado */}
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
