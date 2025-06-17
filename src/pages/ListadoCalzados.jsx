import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ListadoCalzados = () => {
  // Estado para filtros y búsqueda
  const [filter, setFilter] = useState("all"); // 'all', 'dubitadas', 'indubitadas'
  const [searchTerm, setSearchTerm] = useState("");

  // Datos de ejemplo para mostrar en la interfaz
  const exampleData = [
    {
      id: 1,
      marca: "Nike",
      modelo: "Air Max",
      talle: "42",
      medidas: "28cm",
      dibujosSuela: "Ondas, Puntos, Lineas",
      colores: "Blanco/Negro",
      categoria: "Deportivo",
      tipo: "indubitada"
    },
    {
      id: 2,
      marca: "Adidas",
      modelo: "Superstar",
      talle: "40",
      medidas: "26cm",
      dibujosSuela: "Estrellas, Rayas",
      colores: "Negro",
      categoria: "Urbano",
      tipo: "dubitada"
    },
    {
      id: 3,
      marca: "Puma",
      modelo: "RS-X",
      talle: "39",
      medidas: "25cm",
      dibujosSuela: "Geométrico, Cuadrados",
      colores: "Rojo/Blanco",
      categoria: "Casual",
      tipo: "indubitada"
    }
  ];

  // Filtrar datos segun seleccion
  const filteredData = exampleData.filter(item => {
    if (filter === "all") return true;
    return item.tipo === filter;
  });

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">Listado de Calzados</h1>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("indubitada")}
              className={`px-4 py-2 rounded-lg ${filter === "indubitada" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              Indubitadas
            </button>
            <button
              onClick={() => setFilter("dubitada")}
              className={`px-4 py-2 rounded-lg ${filter === "dubitada" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              Dubitadas
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar calzado..."
              className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Talle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibujos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Colores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((calzado) => (
                <tr key={calzado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {calzado.marca}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calzado.modelo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calzado.talle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calzado.medidas}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{calzado.dibujosSuela}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {calzado.colores}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {calzado.categoria}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button className="text-yellow-600 hover:text-yellow-900">
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
      </motion.div>
    </div>
  );
};

export default ListadoCalzados;