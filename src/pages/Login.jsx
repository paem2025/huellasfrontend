import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const { login, logout, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar la ruta inicial según el rol
    const getDefaultRoute = () => {
      if (!user) return "/login";
      
      switch(user.role) {
        case "admin": return "/user-management";
        case "operador": return "/indubitadas";
        case "user": return "/busqueda";
        default: return "/login";
      }
    };
  // Redirigir si ya está autenticado
  useEffect(() => {
      if (isAuthenticated && user) {
        navigate(getDefaultRoute(), { replace: true });
      }
    }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("logout") === "true") {
      logout();
    }
  }, [location.search, logout]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, password } = formData;

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate(getDefaultRoute(), { replace: true });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error interno del sistema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          <FaSignInAlt className="inline mr-2 text-blue-600" />
          Iniciar Sesión
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Usuario:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nombre de usuario"
              required
              disabled={loading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              disabled={loading}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <a
            href="/registro"
            className="text-blue-600 hover:underline"
          >
            Regístrate
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
