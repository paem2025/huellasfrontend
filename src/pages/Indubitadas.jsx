import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import FiguraForm from "../components/FiguraForm";
import MarcaForm from "../components/MarcaForm";
import ModeloForm from "../components/ModeloForm.jsx";
import CategoriaForm from "../components/CategoriaForm";
import ColorForm from "../components/ColorForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";
import { API_URLS } from "../config/api";

const Indubitadas = () => {
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
      const calzadoRes = await axios.post(API_URLS.CALZADOS, {
        id_categoria,
        id_marca,
        id_modelo,
        talle: formData.talle,
        alto: formData.alto,
        ancho: formData.ancho,
        id_colores: ids_colores,  
        tipo_registro: "indubitada_proveedor",
      });

      const id_calzado = calzadoRes.data.calzado?.id_calzado;

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
      });

    } catch (error) {
      console.error("Error al registrar huella indubitada:", error);
      alert("Error al registrar huella indubitada");
    }
  };

  const camposSinBoton = [
    { name: "talle", label: "Talle" },
    { name: "alto", label: "Alto" },
    { name: "ancho", label: "Ancho" },
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
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          <FaCheckCircle className="inline mr-2 text-blue-600" />
          Registrar Huella Indubitada
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
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
          
          {camposSinBoton.map(({ name, label }) => (
            <div key={name} className="mb-4">
              <label className="block text-sm font-semibold mb-1">{label}:</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Ingrese ${label.toLowerCase()}`}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
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
          {/* Campo para descripción general */}
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">
              Descripción General de la Suela:
            </label>
            <textarea
              name="descripcion_general"
              value={formData.descripcion_general}
              onChange={handleChange}
              placeholder="Ingrese una descripción general de la suela"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows="3"
            />
          </div>
            {/* Botón Nueva Figura */}
            <button
              type="button"
              onClick={() => setMostrarFiguraForm(true)}
              className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
            >
              Nueva Figura
            </button>
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

export default Indubitadas;
