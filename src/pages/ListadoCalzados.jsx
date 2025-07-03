import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import axios from "axios";
import FigurasDropdown from "../components/FigurasDropdown";
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

  const [suelaData, setSuelaData] = useState(null);
  const [editSuela, setEditSuela] = useState("");
  const [imputadoData, setImputadoData] = useState(null);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [todosImputados, setTodosImputados] = useState([]);

  // Nuevo estado para editar imputado
  const [editImputado, setEditImputado] = useState({
    id_imputado: null,
    nombre: "",
    dni: "",
    direccion: "",
    comisaria: "",
    jurisdiccion: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch de datos relacionados
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

  const fetchTodosImputados = async () => {
    try {
      const response = await axios.get(`${API_URLS.CALZADOS}todos_imputados_con_calzados`);
      setTodosImputados(response.data);
    } catch (error) {
      console.error("Error al obtener imputados:", error);
    }
  };

  useEffect(() => {
    fetchMarcas();
    fetchModelos();
    fetchCategorias();
    fetchColores();
    fetchTodosImputados();
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

      const response = await axios.patch(
        `${API_URLS.CALZADOS}${editId}`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      alert("Calzado actualizado exitosamente");
      setEditId(null);
      fetchCalzados();
    } catch (error) {
      console.error("Error al actualizar calzado:", error);
      alert(`Error al actualizar calzado: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleDeleteCalzado = async (idCalzado) => {
  if (!window.confirm("¿Estás seguro de que deseas eliminar este calzado?")) return; 

    try {
    const relacion = todosImputados.find(item=>item.calzados.some(calzado=>calzado.id_calzado===idCalzado));
    await axios.delete(`${API_URLS.CALZADOS}${idCalzado}`);
      alert("Calzado eliminado exitosamente");
      fetchCalzados();
      fetchTodosImputados();
  } catch (error) {
    console.error("Error al eliminar calzado:", error);
    alert("Error al eliminar calzado. Verificá si el ID es correcto o si hay un problema en el servidor.");
  } 
  };  
  
  const fetchSuelaPorCalzado = async (idCalzado, tipoRegistro) => {
    try {
      // Obtener datos de la suela
      const suelaResponse = await axios.get(API_URLS.SUELAS);
      const suela = suelaResponse.data.find((s) => s.id_calzado === idCalzado);
      
      if (suela) {
        setSuelaData(suela);
        setEditSuela(suela.descripcion_general || "");
      } else {
        setSuelaData(null);
      }

      // Si es indubitada comisaría, buscar imputado localmente
      if (tipoRegistro === "indubitada_comisaria") {
        const relacion = todosImputados.find(item => 
          item.calzados.some(calzado => calzado.id_calzado === idCalzado)
        );
        
        if (relacion) {
          setImputadoData(relacion.imputado);
          // Cerrar cualquier edición previa de imputado
          setEditImputado({
            id_imputado: null,
            nombre: "",
            dni: "",
            direccion: "",
            comisaria: "",
            jurisdiccion: ""
          });
        } else {
          setImputadoData(null);
        }
      } else {
        setImputadoData(null);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      alert("Error al cargar los datos adicionales");
    }
  };

  const guardarSuela = async () => {
    try {
      const patchData = { descripcion_general: editSuela };
      await axios.patch(`${API_URLS.SUELAS}${suelaData.id_suela}/partial`, patchData);
      alert("Descripción de suela actualizada correctamente.");
      setSuelaData(null);
      setImputadoData(null);
    } catch (err) {
      console.error("Error al actualizar la suela:", err);
      alert("Error al actualizar la descripción de la suela.");
    }
  };

  // Funciones para manejar la edición del imputado
  const handleEditImputadoClick = (imputado) => {
    console.log("Editando imputado:", imputado); // Debug
    setEditImputado({
      id_imputado: imputado.id_imputado,
      nombre: imputado.nombre,
      dni: imputado.dni,
      direccion: imputado.direccion,
      comisaria: imputado.comisaria,
      jurisdiccion: imputado.jurisdiccion
    });
    // Cerrar el modal de suela/imputado
    setSuelaData(null);
    setImputadoData(null);
  };

  const handleImputadoChange = (e) => {
    setEditImputado({
      ...editImputado,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveImputado = async () => {
    try {
      const response = await axios.patch(
        `${API_URLS.IMPUTADOS}${editImputado.id_imputado}`,
        editImputado
      );
      
      alert("Imputado actualizado exitosamente");
      setEditImputado({
        id_imputado: null,
        nombre: "",
        dni: "",
        direccion: "",
        comisaria: "",
        jurisdiccion: ""
      });
      fetchTodosImputados();
    } catch (error) {
      console.error("Error al actualizar imputado:", error);
      alert(`Error al actualizar imputado: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelImputadoEdit = () => {
    setEditImputado({
      id_imputado: null,
      nombre: "",
      dni: "",
      direccion: "",
      comisaria: "",
      jurisdiccion: ""
    });
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
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
                      onClick={() => fetchSuelaPorCalzado(calzado.id, calzado.tipo)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <FiEye size={18} />
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

        {/* Modal editar calzado */}
        {editId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Editar Calzado</h2>
              <div className="grid grid-cols-1 gap-4">
                
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

        {/* Modal suela e imputado */}
        {suelaData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {imputadoData ? "Detalles del Imputado y Suela" : "Suela del Calzado"}
              </h2>
              
              {imputadoData && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">Datos del Imputado:</h3>
                    <button
                      onClick={() => handleEditImputadoClick(imputadoData)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar imputado"
                    >
                      <FiEdit size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nombre:</p>
                      <p className="text-sm">{imputadoData.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">DNI:</p>
                      <p className="text-sm">{imputadoData.dni}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dirección:</p>
                      <p className="text-sm">{imputadoData.direccion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Comisaría:</p>
                      <p className="text-sm">{imputadoData.comisaria}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700">Jurisdicción:</p>
                      <p className="text-sm">{imputadoData.jurisdiccion}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción General de la Suela
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
                  onClick={() => {
                    setSuelaData(null);
                    setImputadoData(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal editar imputado */}
        {editImputado.id_imputado && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Editar Imputado</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={editImputado.nombre}
                    onChange={handleImputadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={editImputado.dni}
                    onChange={handleImputadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={editImputado.direccion}
                    onChange={handleImputadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comisaría
                  </label>
                  <input
                    type="text"
                    name="comisaria"
                    value={editImputado.comisaria}
                    onChange={handleImputadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jurisdicción
                  </label>
                  <input
                    type="text"
                    name="jurisdiccion"
                    value={editImputado.jurisdiccion}
                    onChange={handleImputadoChange}
                    className="border rounded p-2 w-full"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={handleSaveImputado}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelImputadoEdit}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
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