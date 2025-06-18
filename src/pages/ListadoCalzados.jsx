import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";

const API_URL = "http://localhost:5000/calzados/";

const ListadoCalzados = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [calzados, setCalzados] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editCalzado, setEditCalzado] = useState({ 
    marca: "", 
    modelo: "", 
    talle: "", 
    alto: "", 
    ancho: "", 
    colores: "", 
    categoria: "", 
    tipo_registro: "" 
  });

  useEffect(() => {
    fetchCalzados();
  }, []);

  const fetchCalzados = async () => {
    try {
      const response = await axios.get(API_URL);
      const formattedData = response.data.map((item) => ({
        id: item.id_calzado,
        marca: item.marca,
        modelo: item.modelo,
        talle: item.talle,
        alto: item.alto,  // Mantenemos el valor original de alto
        ancho: item.ancho, // Mantenemos el valor original de ancho
        medidas: `${item.alto}cm x ${item.ancho}cm`, // Cadena formateada para mostrar
        colores: item.colores,
        categoria: item.categoria,
        tipo: item.tipo_registro.toLowerCase(),
      }));
      setCalzados(formattedData);
    } catch (error) {
      console.error("Error al obtener calzados:", error);
    }
  };

  const handleEditCalzadoChange = (e) => {
    setEditCalzado({ ...editCalzado, [e.target.name]: e.target.value });
  };

  const handleEditClick = (calzado) => {
    setEditId(calzado.id);
    setEditCalzado({ 
      marca: calzado.marca, 
      modelo: calzado.modelo, 
      talle: calzado.talle, 
      alto: calzado.alto,  // Usamos el valor original de alto
      ancho: calzado.ancho, // Usamos el valor original de ancho
      colores: calzado.colores, 
      categoria: calzado.categoria, 
      tipo_registro: calzado.tipo 
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.patch(`${API_URL}${editId}`, editCalzado);
      alert("Calzado actualizado exitosamente");
      setEditId(null);
      setEditCalzado({ 
        marca: "", 
        modelo: "", 
        talle: "", 
        alto: "", 
        ancho: "", 
        colores: "", 
        categoria: "", 
        tipo_registro: "" 
      });
      fetchCalzados();
    } catch (error) {
      alert("Error al actualizar calzado");
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditCalzado({ 
      marca: "", 
      modelo: "", 
      talle: "", 
      alto: "", 
      ancho: "", 
      colores: "", 
      categoria: "", 
      tipo_registro: "" 
    });
  };

  const filteredData = calzados
    .filter((item) => {
      if (filter === "dubitada") return item.tipo === "dubitada";
      if (filter === "indubitada") return item.tipo.startsWith("indubitada");
      return true; // 'all'
    })
    .filter((item) =>
      item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Listado de Calzados</h1>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>Todos</button>
            <button onClick={() => setFilter("indubitada")} className={`px-4 py-2 rounded-lg ${filter === "indubitada" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>Indubitadas</button>
            <button onClick={() => setFilter("dubitada")} className={`px-4 py-2 rounded-lg ${filter === "dubitada" ? "bg-purple-600 text-white" : "bg-gray-200"}`}>Dubitadas</button>
          </div>

          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Buscar calzado..." className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <svg className="absolute left-2 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medidas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Colores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((calzado) => (
                <tr key={calzado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{calzado.marca}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calzado.modelo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calzado.talle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calzado.medidas}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{calzado.colores}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{calzado.categoria}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button onClick={() => handleEditClick(calzado)} className="text-yellow-600 hover:text-yellow-900">
                      <FiEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para editar calzado */}
        {editId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Editar Calzado</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input type="text" name="marca" placeholder="Marca" value={editCalzado.marca} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input type="text" name="modelo" placeholder="Modelo" value={editCalzado.modelo} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Talle</label>
                  <input type="text" name="talle" placeholder="Talle" value={editCalzado.talle} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                    <input type="text" name="alto" placeholder="Alto" value={editCalzado.alto} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                    <input type="text" name="ancho" placeholder="Ancho" value={editCalzado.ancho} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colores</label>
                  <input type="text" name="colores" placeholder="Colores" value={editCalzado.colores} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input type="text" name="categoria" placeholder="Categoría" value={editCalzado.categoria} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Registro</label>
                  <input type="text" name="tipo_registro" placeholder="Tipo de Registro" value={editCalzado.tipo_registro} onChange={handleEditCalzadoChange} className="border rounded p-2 w-full" required />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Guardar</button>
                  <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ListadoCalzados;