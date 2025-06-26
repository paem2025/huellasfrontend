// src/pages/Dubitadas.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";

const API_URL_FORMAS = "http://127.0.0.1:5000/formas/";
const API_URL_CALZADOS = "http://127.0.0.1:5000/calzados/";
const API_URL_SUELAS = "http://127.0.0.1:5000/suelas/";

const Dubitadas = () => {
  const [formData, setFormData] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    talle: "",
    alto: "",
    ancho: "",
    colores: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const calzadoRes = await axios.post(API_URL_CALZADOS, {
        categoria: formData.categoria,
        marca: formData.marca,
        modelo: formData.modelo,
        talle: formData.talle,
        alto: formData.alto,
        ancho: formData.ancho,
        colores: formData.colores,
        tipo_registro: "dubitada",
      });

      const id_calzado = calzadoRes.data.id_calzado;

      const figurasResponse = await axios.get(API_URL_FORMAS);
      const figurasDB = figurasResponse.data;

      const obtenerIdForma = (nombreFigura) => {
        const figura = figurasDB.find((f) => f.nombre === nombreFigura);
        return figura ? figura.id_forma : null;
      };

      const detalles = [];
      const agregarDetalles = (figuras, id_cuadrante) => {
        figuras.forEach((nombreFigura) => {
          const id_forma = obtenerIdForma(nombreFigura);
          if (id_forma) {
            detalles.push({ id_forma, id_cuadrante, detalle_adicional: "" });
          }
        });
      };

      agregarDetalles(formData.figurasSuperiorIzquierdo, 1);
      agregarDetalles(formData.figurasSuperiorDerecho, 2);
      agregarDetalles(formData.figurasInferiorIzquierdo, 3);
      agregarDetalles(formData.figurasInferiorDerecho, 4);
      agregarDetalles(formData.figurasCentral, 5);

      await axios.post(API_URL_SUELAS, {
        id_calzado,
        descripcion_general: formData.descripcion_general || "Huella dubitada registrada",
        detalles,
      });

      alert("Huella dubitada registrada con éxito ✅");

      setFormData({
        categoria: "",
        marca: "",
        modelo: "",
        talle: "",
        alto: "",
        ancho: "",
        colores: "",
        descripcion_general: "",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorDerecho: [],
        figurasInferiorIzquierdo: [],
      });

    } catch (error) {
      console.error("Error al registrar huella dubitada:", error);
      alert("❌ Error al registrar huella dubitada");
    }
  };

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);
  
  //Estado para figuras
  const [figuras, setFiguras] = useState([]);
  
  const fetchFiguras = () => {
    axios
      .get(API_URL_FORMAS)
      .then((response) => {
        setFiguras(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener figuras:", error);
      });
  };
  
  useEffect(() => {
    fetchFiguras();
  }, []);
      
  const renderInput = (name, label, placeholder = "") => (
    <div key={name}>
      <label className="block text-sm font-semibold mb-1">{label}:</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );

  //Reemplazar formulario Dubitadas por FiguraForm si mostrarFiguraForm es igual a true
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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl mx-auto transition hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
        Registrar Huella Dubitada
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Categoría */}
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría:</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Urbano">Urbano</option>
            <option value="Trabajo">Trabajo</option>
          </select>
        </div>

        <hr className="my-4" />

        {renderInput("marca", "Marca")}
        {renderInput("modelo", "Modelo")}
        {renderInput("talle", "Talle")}
        {renderInput("alto", "Alto", "Ingrese alto")}
        {renderInput("ancho", "Ancho", "Ingrese ancho")}
        {renderInput("colores", "Colores", "Ingrese colores")}

        {/* Seleccionaon de figuras por cuadrante */}
        <div>
          <label className="block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              rows="3"
            />
          </div>
          
          {/* Botón Nueva Figura */}
          <button
            type="button"
            onClick={() => setMostrarFiguraForm(true)}
            className="mt-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
          >
            Nueva Figura
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default Dubitadas;