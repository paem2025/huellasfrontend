import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import MarcaForm from "../components/MarcaForm";
import ModeloForm from "../components/ModeloForm";
import CategoriaForm from "../components/CategoriaForm";
import ColorForm from "../components/ColorForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";
import { API_URLS } from "../config/api";

const IndubitadasComisaria = () => {
  const [formData, setFormData] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    talle: "",
    alto: "",
    ancho: "",
    colores: [],
    descripcion_general: "",
    //Arrays que guardan las figuras de cada cuadrante
    figurasSuperiorIzquierdo: [],
    figurasSuperiorDerecho: [],
    figurasCentral: [],
    figurasInferiorDerecho: [],
    figurasInferiorIzquierdo: [],
    nombre: "",
    dni: "",
    direccion: "",
    comisaria: "",
    jurisdiccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);
  const [mostrarMarcaForm, setMostrarMarcaForm] = useState(false);
  const [mostrarModeloForm, setMostrarModeloForm] = useState(false);
  const [mostrarCategoriaForm, setMostrarCategoriaForm] = useState(false);
  const [mostrarColorForm, setMostrarColorForm] = useState(false);
  
  const [figuras, setFiguras] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);

  const fetchFiguras = () => {
    axios
      .get(API_URLS.FORMAS)
      .then((response) => setFiguras(response.data))
      .catch((error) => console.error("Error al obtener figuras:", error));
  };

  const fetchMarcas = () => {
    axios
      .get(API_URLS.MARCAS)
      .then((response) => setMarcas(response.data))
      .catch((error) => console.error("Error al obtener marcas:", error));
  };

  const fetchModelos = () => {
    axios
      .get(API_URLS.MODELOS)
      .then((response) => setModelos(response.data))
      .catch((error) => console.error("Error al obtener modelos:", error));
  };

  const fetchCategorias = () => {
    axios
      .get(API_URLS.CATEGORIAS)
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Error al obtener categorías:", error));
  };

  const fetchColores = () => {
    axios
      .get(API_URLS.COLORES)
      .then((response) => setColores(response.data))
      .catch((error) => console.error("Error al obtener colores:", error));
  };

  useEffect(() => {
    fetchFiguras();
    fetchMarcas();
    fetchModelos();
    fetchCategorias();
    fetchColores();
  }, []);

  const obtenerIdForma = (nombreFigura) => {
    const figura = figuras.find((f) => f.nombre.toLowerCase() === nombreFigura.toLowerCase());
    return figura ? figura.id_forma : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(formData.dni)) {
      alert("Error: El DNI debe contener 8 digitos.");
      return;
    }

    try {

      if (!formData.categoria || formData.categoria.trim() === "" ||
          !formData.marca || formData.marca.trim() === "" ||
          !formData.modelo || formData.modelo.trim() === "" ||
          !formData.colores || formData.colores.length === 0
      ) {
        alert("Error: Los campos categoría, marca, modelo y colores son obligatorios.");
        return;
      }

      const categoriaObj = categorias.find(c => c.nombre.toLowerCase() === formData.categoria.toLowerCase());
      const id_categoria = categoriaObj?.id_categoria;

      const marcaObj = marcas.find(m => m.nombre.toLowerCase() === formData.marca.toLowerCase());
      const id_marca = marcaObj?.id_marca;

      const modeloObj = modelos.find(m => m.nombre.toLowerCase() === formData.modelo.toLowerCase());
      const id_modelo = modeloObj?.id_modelo;

      const ids_colores = colores
        .filter(c => formData.colores.includes(c.nombre))
        .map(c => c.id_color);

      if (!id_categoria || !id_marca || !id_modelo || ids_colores.length === 0) {
        alert("Error: La categoría, marca, modelo y colores seleccionados no existen en el sistema.");
        return;
      }

      // Calzado
      const calzadoImputadoRes = await axios.post(`${API_URLS.CALZADOS}cargar_calzado_imputado`, {
        imputado: {
          nombre: formData.nombre,
          dni: formData.dni,
          direccion: formData.direccion,
          comisaria: formData.comisaria,
          jurisdiccion: formData.jurisdiccion,
        },
        calzado: {
          id_categoria,
          id_marca,
          id_modelo,
          talle: formData.talle,
          alto: formData.alto,
          ancho: formData.ancho,
          id_colores: ids_colores,
          tipo_registro: "indubitada_comisaria",
        },
      });

      const id_calzado = calzadoImputadoRes.data.calzado_id;

      if (!id_calzado) {
        alert("Error: no se recibió id_calzado del backend");
        return;
      }

      // Detalles suela
      const cuadrantesMap = {
        figurasSuperiorIzquierdo: 1, //Los IDs corresponden a los cuadrantes que deben estar insertados en este mismo orden
        figurasSuperiorDerecho: 2,
        figurasInferiorIzquierdo: 3,
        figurasInferiorDerecho: 4,
        figurasCentral: 5,
      };

      let detalles = [];

      Object.entries(cuadrantesMap).forEach(([key, id_cuadrante]) => {
        formData[key].forEach((nombreFigura) => {
          const id_forma = obtenerIdForma(nombreFigura);
          if (id_forma) {
            detalles.push({
              id_cuadrante,
              id_forma,
              detalle_adicional: "", 
            });
          }
        });
      });

      // Suela
      await axios.post(API_URLS.SUELAS, {
        id_calzado,
        descripcion_general: formData.descripcion_general || "",
        detalles,
      });

      alert("Huella indubitada registrada exitosamente");

      setFormData({
        categoria: "",
        marca: "",
        modelo: "",
        colores: [],
        talle: "",
        alto: "",
        ancho: "",
        descripcion_general: "",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorDerecho: [],
        figurasInferiorIzquierdo: [],
        nombre: "",
        apellido: "",
        dni: "",
        direccion: "",
        comisaria: "",
        jurisdiccion: "",
        
      });

    } catch (error) {
      console.error("Error al registrar huella indubitada:", error);
      alert("Error al registrar huella indubitada");
    }
  };

  const fields = [
    { name: "talle", label: "Talle" },
    { name: "alto", label: "Alto" },
    { name: "ancho", label: "Ancho" },
    { name: "nombre", label: "Nombre y Apellido" },
    { name: "dni", label: "DNI" },
    { name: "direccion", label: "Dirección" },
    { name: "comisaria", label: "Comisaría" },
    { name: "jurisdiccion", label: "Jurisdicción" },
  ];

  if (mostrarFiguraForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FiguraForm 
          onClose={() => setMostrarFiguraForm(false)} 
          onUpdateFiguras={fetchFiguras}
        />
      </motion.div>
    );
  }

  if (mostrarMarcaForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MarcaForm
          onClose={() => setMostrarMarcaForm(false)}
          onUpdateMarcas={fetchMarcas}
        />
      </motion.div>
    );
  }

  if (mostrarModeloForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ModeloForm
          onClose={() => setMostrarModeloForm(false)}
          onUpdateModelos={fetchModelos}
        />
      </motion.div>
    );
  }

  if (mostrarCategoriaForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <CategoriaForm
          onClose={() => setMostrarCategoriaForm(false)}
          onUpdateCategorias={fetchCategorias}
        />
      </motion.div>
    );
  }

  if (mostrarColorForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ColorForm
          onClose={() => setMostrarColorForm(false)}
          onUpdateColores={fetchColores}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto transition hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Registrar Huella Indubitada (Comisarías)
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-blue-600">Datos del Calzado</h3>
            {/* Datos del calzado */}
            
            {/* Categoría */}
            <FigurasDropdown
              title="Categoría"
              options={categorias.map(c => c.nombre)}
              selectedOptions={formData.categoria ? [formData.categoria] : []}
              onChange={(selected) => setFormData(prev => ({ ...prev, categoria: selected[0] || "" }))}
              multiple={false}
            />
            <button
              type="button"
              onClick={() => setMostrarCategoriaForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nueva Categoría
            </button>

            {/* Marca */}
            <FigurasDropdown
              title="Marca"
              options={marcas.map(m => m.nombre)}
              selectedOptions={formData.marca ? [formData.marca] : []}
              onChange={(selected) => setFormData(prev => ({ ...prev, marca: selected[0] || "" }))}
              multiple={false}
            />
            <button
              type="button"
              onClick={() => setMostrarMarcaForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nueva Marca
            </button>

            {/* Modelo */}
            <FigurasDropdown
              title="Modelo"
              options={modelos.map(m => m.nombre)}
              selectedOptions={formData.modelo ? [formData.modelo] : []}
              onChange={(selected) => setFormData(prev => ({ ...prev, modelo: selected[0] || "" }))}
              multiple={false}
            />
            <button
              type="button"
              onClick={() => setMostrarModeloForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nuevo Modelo
            </button>

            {/* Colores */}
            <FigurasDropdown
              title="Colores"
              options={colores.map(c => c.nombre)}
              selectedOptions={formData.colores}
              onChange={(selected) => setFormData(prev => ({ ...prev, colores: selected }))}
              multiple={true}
            />
            <button
              type="button"
              onClick={() => setMostrarColorForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nuevo Color
            </button>
          
            {fields.slice(0, 3).map(({ name, label, type, options }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1">{label}:</label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  >
                    <option value="">Seleccionar {label.toLowerCase()}</option>
                    {options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min={name === "talle" ? "1" : "0.01"}
                      step={name === "talle" ? "1" : "any"}
                      onKeyDown={(e) => {
                        const blockedKeys = [".", ","];
                        if (name === "talle") {
                          if (blockedKeys.includes(e.key)) {
                            e.preventDefault();
                          }
                        }
                      }}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={`Ingrese ${label.toLowerCase()}`}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    required
                  />
                )}
              </div>
            ))}

            {/* Seleccion de figuras por cuadrante */}
            <div>
              <label className = "block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
                <FigurasDropdown title="Cuadrante Superior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorIzquierdo: selected }))} />
                <FigurasDropdown title="Cuadrante Superior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorDerecho: selected }))} />
                <FigurasDropdown title="Cuadrante Central" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasCentral} onChange={(selected) => setFormData(prev => ({ ...prev, figurasCentral: selected }))} />
                <FigurasDropdown title="Cuadrante Inferior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorIzquierdo: selected }))} />
                <FigurasDropdown title="Cuadrante Inferior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorDerecho: selected }))} />
            </div>
            {/* Botón Nueva Figura */}
            <button
              type="button"
              onClick={() => setMostrarFiguraForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nueva Figura
            </button>
            
            {/* Descripción general de la suela */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">
                Descripción General de la Suela:
              </label>
              <textarea
                name="descripcion_general"
                value={formData.descripcion_general}
                onChange={handleChange}
                placeholder="Ingrese una descripción general de la suela"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                rows="3"
              />
              </div>
          </div>

          {/* Datos imputados */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Datos del Imputado</h3>

            {/* Campo DNI con control de 8 dígitos */}
            <div>
              <label className="block text-sm font-semibold mb-1">DNI:</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 8);
                  if (/^\d*$/.test(value)) {
                    handleChange({ target: { name: "dni", value } });
                  }
                }}
                placeholder="Ingrese dni"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                required
              />
            </div>
            {fields.slice(3, 9).filter(({ name }) => name !== "dni").map(({ name, label }) => (
              <div key={name}>
                <label className="block text-sm font-semibold mb-1">{label}:</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
          >
            Registrar
          </button>
        </form>
      </div>
    </motion.div>
  );
};


export default IndubitadasComisaria;