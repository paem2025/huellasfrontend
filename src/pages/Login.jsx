import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const { login, logout } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("logout") === "true") {
      logout();
    }
  }, [location.search, logout]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(
        (u) => u.username === username && u.password === password
      );
      if (found) {
        login(found);
        navigate("/indubitadas", { replace: true });
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (e) {
      console.error("Error al iniciar sesión:", e);
      setError("Error al acceder a los datos");
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
          >
            Entrar
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
