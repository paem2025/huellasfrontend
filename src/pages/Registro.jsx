// Registro.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

const Registro = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    let { username, password, confirmPassword } = formData;
    username = username.trim().toLowerCase();

    if (!username || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      const userExists = existingUsers.some(
        (user) => user.username === username
      );

      if (userExists) {
        setError("El nombre de usuario ya está registrado");
        return;
      }

      const newUser = { username, password, role: "operador" };
      localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));

      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Error al registrar el usuario:", e);
      setError("Ocurrió un error al guardar los datos");
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
          <FaUserPlus className="inline mr-2 text-blue-600" />
          Crear Cuenta
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
              placeholder="Ingrese un nombre de usuario"
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
              placeholder="Ingrese una contraseña"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme su contraseña"
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
          >
            Registrarse
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Registro;
