import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(null); // Inicializar en null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // Establecer los datos del usuario
          setRole(data.role); // Establecer el rol
        } else {
          logout(); // Si el token es inválido, cerrar sesión
        }
      } catch {
        logout(); // Si ocurre un error en la solicitud
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]); // El useEffect depende del token

  const login = async (newToken, newRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);

    try {
      const res = await fetch("http://localhost:5001/auth/user", {
        headers: { Authorization: `Bearer ${newToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // Establecer los datos del usuario al hacer login
      }
    } catch (error) {
      console.error("Error cargando usuario tras login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null); // Limpiar datos del usuario
  };

  return (
    <AuthContext.Provider value={{ token, user, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
