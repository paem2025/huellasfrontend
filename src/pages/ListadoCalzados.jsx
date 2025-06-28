import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import axios from "axios";
import EditCalzadoModal from "../components/EditCalzadoModal";
import SuelaModal from "../components/SuelaModal";
import { API_URLS } from "../config/api";

const ListadoCalzados = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [calzados, setCalzados] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editCalzado, setEditCalzado] = useState({
    id_marca: "",
    id_modelo: "",
    talle: "",
    alto: "",
    ancho: "",
    id_colores: [],
    id_categoria: "",
    tipo_registro: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [suelaData, setSuelaData] = useState(null);
  const [editSuela, setEditSuela] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);

  const fetchMarcas = async () => {
    try {
      const response = await axios.get(API_URLS.MARCAS);
      setMarcas(response.data);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  const fetchModelos = async () => {
    try {
      const response = await axios.get(API_URLS.MODELOS);
      setModelos(response.data);
    } catch (error) {
      console.error("Error al obtener modelos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(API_URLS.CATEGORIAS);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchColores = async () => {
    try {
      const response = await axios.get(API_URLS.COLORES);
      setColores(response.data);
    } catch (error) {
      console.error("Error al obtener colores:", error);
    }
  };

  useEffect(() => {
    fetchMarcas();
    fetchModelos();
    fetchCategorias();
    fetchColores();
  }, []);

  const fetchCalzados = async () => {
  try {
    let endpoint = API_URLS.CALZADOS; 
    let calzadosData;

    if (filter === "dubitada") {
      endpoint = `${API_URLS.CALZADOS}getAllDubitadas`;
      const response = await axios.get(endpoint);
      calzadosData = response.data;
    } 
    else if (filter === "indubitada_proveedor" || filter === "indubitada_comisaria") {
      const response = await axios.get(API_URLS.CALZADOS);
      calzadosData = response.data.filter(item => 
        item.tipo_registro === filter
      );
    }
    else {
      const response = await axios.get(endpoint);
      calzadosData = response.data;
    }


    const formattedData = calzadosData.map((item) => {
      const marca =
        marcas.find((m) => m.id_marca === item.id_marca)?.nombre ||
        "Sin marca";
      const modelo =
        modelos.find((m) => m.id_modelo === item.id_modelo)?.nombre ||
        "Sin modelo";
      const categoria =
        categorias.find((c) => c.id_categoria === item.id_categoria)
          ?.nombre || "Sin categoría";

      let coloresNombres = "Sin colores";
      let idsColores = [];

      if (Array.isArray(item.colores) && item.colores.length > 0) {
        if (typeof item.colores[0] === "string") {
          coloresNombres = item.colores.join(", ");
          idsColores = item.colores
            .map((nombre) => colores.find((c) => c.nombre === nombre)?.id_color)
            .filter(Boolean);
        } else {
          coloresNombres = item.colores.map((c) => c.nombre).join(", ");
          idsColores = item.colores.map((c) => c.id_color);
        }
      }

      return {
        id: item.id_calzado,
        marca,
        modelo,
        talle: item.talle,
        alto: item.alto,
        ancho: item.ancho,
        medidas: `${item.alto}cm x ${item.ancho}cm`,
        colores: coloresNombres,
        categoria,
        tipo: item.tipo_registro,
        id_marca: item.id_marca,
        id_modelo: item.id_modelo,
        id_categoria: item.id_categoria,
        id_colores: idsColores,
      };
    });

      setCalzados(formattedData);
    } catch (error) {
      console.error("Error al obtener calzados:", error);
      alert("Error al cargar los calzados");
    }
  };

  useEffect(() => {
    fetchCalzados();
  }, [filter, marcas, modelos, categorias, colores]);

  const handleEditCalzadoChange = (e) => {
    if (e.target.name === "id_colores") {
      setEditCalzado({ ...editCalzado, [e.target.name]: e.target.value });
    } else if (e.target.name === "alto" || e.target.name === "ancho") {
      setEditCalzado({ ...editCalzado, [e.target.name]: parseFloat(e.target.value) || null });
    } else {
      setEditCalzado({ ...editCalzado, [e.target.name]: e.target.value });
    }
  };

  const handleEditClick = (calzado) => {
    setEditId(calzado.id);
    setEditCalzado({
      id_marca: calzado.id_marca || null,
      id_modelo: calzado.id_modelo || null,
      talle: calzado.talle || null,
      alto: calzado.alto ? parseFloat(calzado.alto) : null,
      ancho: calzado.ancho ? parseFloat(calzado.ancho) : null,
      id_colores: Array.isArray(calzado.id_colores) ? 
                calzado.id_colores.map(id => parseInt(id)) : 
                [],
      id_categoria: calzado.id_categoria || null,
      tipo_registro: calzado.tipo || null,
    });
  };

  const handleSaveEdit = async () => {
    try {

      const dataToSend = {
        alto: editCalzado.alto || null,
        ancho: editCalzado.ancho || null,
        talle: editCalzado.talle || null,
        tipo_registro: editCalzado.tipo_registro || null,
        id_marca: editCalzado.id_marca || null,
        id_modelo: editCalzado.id_modelo || null,
        id_categoria: editCalzado.id_categoria || null,
        id_colores: Array.isArray(editCalzado.id_colores) ? 
                  editCalzado.id_colores.map(id => parseInt(id)) : 
                  []
      };

      console.log("Datos a enviar:", dataToSend); 

      const response = await axios.patch(
        `${API_URLS.CALZADOS}${editId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Respuesta del servidor:", response.data);
      alert("Calzado actualizado exitosamente");
      setEditId(null);
      fetchCalzados();
    } catch (error) {
      console.error("Detalles del error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      alert(`Error al actualizar calzado: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleDeleteCalzado = async (idCalzado) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este calzado?")) {
      return;
    }

    try {
      await axios.delete(`${API_URLS.CALZADOS}${idCalzado}`);
      alert("Calzado eliminado exitosamente");
      fetchCalzados();
    } catch (error) {
      console.error("Error al eliminar calzado:", error);
      alert("Error al eliminar calzado");
    }
  };

  const fetchSuelaPorCalzado = async (idCalzado) => {
    try {
      const response = await axios.get(API_URLS.SUELAS);
      const suela = response.data.find((s) => s.id_calzado === idCalzado);

      if (suela) {
        setSuelaData(suela);
        setEditSuela(suela.descripcion_general || "");
      } else {
        alert("No se encontró una suela para este calzado.");
      }
    } catch (error) {
      console.error("Error al obtener suela:", error);
    }
  };

  const guardarSuela = async () => {
    try {
      const patchData = { descripcion_general: editSuela };
      await axios.patch(`${API_URLS.SUELAS}${suelaData.id_suela}/partial`, patchData);
      alert("Descripción de suela actualizada correctamente.");
      setSuelaData(null);
    } catch (err) {
      console.error("Error al actualizar la suela:", err);
      alert("Error al actualizar la descripción de la suela.");
    }
  };

  const filteredData = calzados.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(item.marca).toLowerCase().includes(searchLower) ||
      String(item.modelo).toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Listado de Calzados
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("indubitada_proveedor")}
              className={`px-4 py-2 rounded-lg ${
                filter === "indubitada_proveedor"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Indubitadas (Proveedor)
            </button>
            <button
              onClick={() => setFilter("indubitada_comisaria")}
              className={`px-4 py-2 rounded-lg ${
                filter === "indubitada_comisaria"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Indubitadas (Comisaría)
            </button>
            <button
              onClick={() => setFilter("dubitada")}
              className={`px-4 py-2 rounded-lg ${
                filter === "dubitada"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
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
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Talle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Medidas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Colores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((calzado) => (
                <tr key={calzado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                    {calzado.marca}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {calzado.modelo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {calzado.talle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {calzado.medidas}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {calzado.colores}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {calzado.categoria}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                    {calzado.tipo === "dubitada"
                      ? "Dubitada"
                      : calzado.tipo === "indubitada_proveedor"
                      ? "Indubitada (Proveedor)"
                      : calzado.tipo === "indubitada_comisaria"
                      ? "Indubitada (Comisaría)"
                      : calzado.tipo}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(calzado)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCalzado(calzado.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <FiTrash2 size={18} />
                    </button>
                    <button
                      onClick={() => fetchSuelaPorCalzado(calzado.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver suela"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Mostrar:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">por página</span>
            </div>
            
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}

        <EditCalzadoModal
          editId={editId}
          editCalzado={editCalzado}
          marcas={marcas}
          modelos={modelos}
          categorias={categorias}
          colores={colores}
          onEditCalzadoChange={handleEditCalzadoChange}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />

        <SuelaModal
          suelaData={suelaData}
          editSuela={editSuela}
          setEditSuela={setEditSuela}
          onGuardarSuela={guardarSuela}
          onClose={() => setSuelaData(null)}
        />
      </motion.div>
    </div>
  );
};

export default ListadoCalzados;
