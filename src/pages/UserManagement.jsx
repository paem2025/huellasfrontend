import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaUserCog, FaUserShield, FaUser, FaPlus, FaSearch } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Formulario de agregar usuario
  const [addFormData, setAddFormData] = useState({
    username: "",
    role: "user",
    password: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Obtener lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/usuarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error al cargar los usuarios");
        toast.error(error.response?.data?.error || "No tienes permisos para ver usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Eliminar usuario
  const handleDelete = async (userId) => {
    if (userId === currentUser?.id) {
      toast.error("No puedes eliminar tu propio usuario");
      return;
    }

    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;

    try {
      await axios.delete(`http://localhost:5000/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.error || "Error al eliminar el usuario");
    }
  };

  // Manejar cambios en el formulario
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({
      ...addFormData,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {
      username: "",
      password: "",
      confirmPassword: "",
      general: ""
    };
    let isValid = true;

    if (!addFormData.username.trim()) {
      errors.username = "El nombre de usuario es obligatorio";
      isValid = false;
    }

    if (!addFormData.password) {
      errors.password = "La contraseña es obligatoria";
      isValid = false;
    } else if (addFormData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    if (addFormData.password !== addFormData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Agregar nuevo usuario
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({
      username: "",
      password: "",
      confirmPassword: "",
      general: ""
    });

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = addFormData;
      
      const response = await axios.post(
        "http://localhost:5000/usuarios", 
        userData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        toast.success("Usuario creado exitosamente");
        
        const usersResponse = await axios.get("http://localhost:5000/usuarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        setUsers(usersResponse.data);
        setShowAddUser(false);
        setAddFormData({
          username: "",
          role: "user",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          setFormErrors({
            ...formErrors,
            general: error.response.data.error || "Datos inválidos"
          });
        } else if (error.response.status === 409) {
          setFormErrors({
            ...formErrors,
            username: "Este nombre de usuario ya está en uso"
          });
        } else if (error.response.status === 403) {
          setFormErrors({
            ...formErrors,
            general: "No tienes permisos para crear usuarios"
          });
        } else {
          setFormErrors({
            ...formErrors,
            general: error.response.data?.error || `Error del servidor (${error.response.status})`
          });
        }
      } else {
        setFormErrors({
          ...formErrors,
          general: "Error de conexión con el servidor"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar icono según rol
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-red-500" />;
      case "moderator":
        return <FaUserCog className="text-blue-500" />;
      default:
        return <FaUser className="text-green-500" />;
    }
  };

  // Mostrar nombre del rol
  const getRoleName = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "moderator":
        return "Moderador";
      default:
        return "Operador";
    }
  };

  // Filtrar y paginar usuarios
  const filteredData = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(user.username).toLowerCase().includes(searchLower) ||
      String(user.role).toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <div className="text-center py-8">Cargando usuarios...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
          <FaUserCog className="mr-2" /> Gestión de Usuarios
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              showAddUser ? "bg-gray-500 hover:bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
            } text-white`}
          >
            <FaPlus className="mr-2" /> {showAddUser ? "Cancelar" : "Agregar Usuario"}
          </button>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {showAddUser && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Usuario</h2>
            {formErrors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {formErrors.general}
              </div>
            )}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={addFormData.username}
                  onChange={handleAddChange}
                  className={`w-full p-2 border rounded ${formErrors.username ? 'border-red-500' : ''}`}
                  required
                  disabled={isSubmitting}
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol:</label>
                <select
                  name="role"
                  value={addFormData.role}
                  onChange={handleAddChange}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isSubmitting}
                >
                  <option value="user">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={addFormData.password}
                  onChange={handleAddChange}
                  className={`w-full p-2 border rounded ${formErrors.password ? 'border-red-500' : ''}`}
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Contraseña:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={addFormData.confirmPassword}
                  onChange={handleAddChange}
                  className={`w-full p-2 border rounded ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                  required
                  minLength={6}
                  disabled={isSubmitting}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
              <button
                type="submit"
                className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </>
                ) : (
                  "Crear Usuario"
                )}
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eliminar</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="flex items-center">
                      {getRoleIcon(user.role)} <span className="ml-2">{getRoleName(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                      disabled={user.id === currentUser?.id}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center space-x-2 p-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num ? "bg-purple-600 text-white" : "bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserManagement;