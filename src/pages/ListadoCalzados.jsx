import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import axios from "axios";
import FigurasDropdown from "../components/FigurasDropdown";

const API_URL_CALZADOS = "http://localhost:5000/calzados/";
const API_URL_SUELAS = "http://localhost:5000/suelas/";
const API_URL_MARCAS = "http://localhost:5000/marcas/";
const API_URL_MODELOS = "http://localhost:5000/modelos/";
const API_URL_CATEGORIAS = "http://localhost:5000/categorias/";
const API_URL_COLORES = "http://localhost:5000/colores/";

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

  const [suelaData, setSuelaData] = useState(null);
  const [editSuela, setEditSuela] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);

  // Fetch de datos relacionados
  const fetchMarcas = async () => {
    try {
      const response = await axios.get(API_URL_MARCAS);
      setMarcas(response.data);
    } catch (error) {
      console.error("Error al obtener marcas:", error);
    }
  };

  const fetchModelos = async () => {
    try {
      const response = await axios.get(API_URL_MODELOS);
      setModelos(response.data);
    } catch (error) {
      console.error("Error al obtener modelos:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(API_URL_CATEGORIAS);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchColores = async () => {
    try {
      const response = await axios.get(API_URL_COLORES);
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
      let endpoint = "";

      switch (filter) {
        case "dubitada":
          endpoint = `${API_URL_CALZADOS}getAllDubitadas`;
          break;
        case "indubitada":
          endpoint = `${API_URL_CALZADOS}getAllIndubitadas`;
          break;
        default:
          endpoint = API_URL_CALZADOS;
      }

      const response = await axios.get(endpoint);
      const calzadosData = response.data;

      // Formatear los datos para mostrar
      const formattedData = calzadosData.map((item) => {
        // Obtener nombres de relaciones
        const marca =
          marcas.find((m) => m.id_marca === item.id_marca)?.nombre ||
          "Sin marca";
        const modelo =
          modelos.find((m) => m.id_modelo === item.id_modelo)?.nombre ||
          "Sin modelo";
        const categoria =
          categorias.find((c) => c.id_categoria === item.id_categoria)
            ?.nombre || "Sin categoría";

        // Obtener nombres de colores y sus IDs
        let coloresNombres = "Sin colores";
        let idsColores = [];

        if (Array.isArray(item.colores) && item.colores.length > 0) {
          if (typeof item.colores[0] === "string") {
            // Si vienen como strings
            coloresNombres = item.colores.join(", ");
            idsColores = item.colores
              .map((nombre) => colores.find((c) => c.nombre === nombre)?.id_color)
              .filter(Boolean);
          } else {
            // Si vienen como objetos
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
          // Guardar IDs para edición
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
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((option) => parseInt(option.value));
    setEditCalzado({ ...editCalzado, [e.target.name]: values });
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
      // Preparar los datos en el formato que espera el backend
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

      console.log("Datos a enviar:", dataToSend); // Para depuración

      const response = await axios.patch(
        `${API_URL_CALZADOS}${editId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Respuesta del servidor:", response.data); // Para depuración
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
      await axios.delete(`${API_URL_CALZADOS}${idCalzado}`);
      alert("Calzado eliminado exitosamente");
      fetchCalzados();
    } catch (error) {
      console.error("Error al eliminar calzado:", error);
      alert("Error al eliminar calzado");
    }
  };

  const fetchSuelaPorCalzado = async (idCalzado) => {
    try {
      const response = await axios.get(API_URL_SUELAS);
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
      await axios.patch(`${API_URL_SUELAS}${suelaData.id_suela}/partial`, patchData);
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
              onClick={() => setFilter("indubitada")}
              className={`px-4 py-2 rounded-lg ${
                filter === "indubitada"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Indubitadas
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
              {filteredData.map((calzado) => (
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

        {/* Modal editar calzado */}
        {editId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Editar Calzado</h2>
              <div className="grid grid-cols-1 gap-4">
                
                {/* Marca - Reemplazado con FigurasDropdown */}
                <FigurasDropdown
                  title="Marca"
                  options={marcas.map(m => m.nombre)}
                  selectedOptions={editCalzado.id_marca ? [marcas.find(m => m.id_marca === editCalzado.id_marca)?.nombre || ""] : []}
                  onChange={(selected) => {
                    const selectedMarca = marcas.find(m => m.nombre === selected[0]);
                    setEditCalzado({...editCalzado, id_marca: selectedMarca?.id_marca || null});
                  }}
                  multiple={false}
                  required
                />

                {/* Modelo - Reemplazado con FigurasDropdown */}
                <FigurasDropdown
                  title="Modelo"
                  options={modelos.map(m => m.nombre)}
                  selectedOptions={editCalzado.id_modelo ? [modelos.find(m => m.id_modelo === editCalzado.id_modelo)?.nombre || ""] : []}
                  onChange={(selected) => {
                    const selectedModelo = modelos.find(m => m.nombre === selected[0]);
                    setEditCalzado({...editCalzado, id_modelo: selectedModelo?.id_modelo || null});
                  }}
                  multiple={false}
                  required
                />

                {/* Categoría - Reemplazado con FigurasDropdown */}
                <FigurasDropdown
                  title="Categoría"
                  options={categorias.map(c => c.nombre)}
                  selectedOptions={editCalzado.id_categoria ? [categorias.find(c => c.id_categoria === editCalzado.id_categoria)?.nombre || ""] : []}
                  onChange={(selected) => {
                    const selectedCategoria = categorias.find(c => c.nombre === selected[0]);
                    setEditCalzado({...editCalzado, id_categoria: selectedCategoria?.id_categoria || null});
                  }}
                  multiple={false}
                  required
                />

                {/* Colores - Reemplazado con FigurasDropdown (multiple) */}
                <FigurasDropdown
                  title="Colores"
                  options={colores.map(c => c.nombre)}
                  selectedOptions={editCalzado.id_colores.map(id => colores.find(c => c.id_color === id)?.nombre).filter(Boolean)}
                  onChange={(selected) => {
                    const selectedIds = selected.map(name => 
                      colores.find(c => c.nombre === name)?.id_color
                    ).filter(Boolean);
                    setEditCalzado({...editCalzado, id_colores: selectedIds});
                  }}
                  multiple={true}
                  required
                />

                {/* Tipo de Registro - Reemplazado con FigurasDropdown */}
                <FigurasDropdown
                  title="Tipo de Registro"
                  options={["dubitada", "indubitada_proveedor", "indubitada_comisaria"]}
                  selectedOptions={editCalzado.tipo_registro ? [editCalzado.tipo_registro] : []}
                  onChange={(selected) => {
                    setEditCalzado({...editCalzado, tipo_registro: selected[0] || null});
                  }}
                  multiple={false}
                  required
                />

                {/* Los inputs numéricos y botones se mantienen igual */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alto (cm)
                    </label>
                    <input
                      type="number"
                      name="alto"
                      value={editCalzado.alto}
                      onChange={handleEditCalzadoChange}
                      className="border rounded p-2 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ancho (cm)
                    </label>
                    <input
                      type="number"
                      name="ancho"
                      value={editCalzado.ancho}
                      onChange={handleEditCalzadoChange}
                      className="border rounded p-2 w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talle
                  </label>
                  <input
                    type="text"
                    name="talle"
                    value={editCalzado.talle}
                    onChange={handleEditCalzadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal suela */}
        {suelaData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Suela del Calzado</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción General
                </label>
                <textarea
                  value={editSuela}
                  onChange={(e) => setEditSuela(e.target.value)}
                  rows={4}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={guardarSuela}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setSuelaData(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ListadoCalzados;
