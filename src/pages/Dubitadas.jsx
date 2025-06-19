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
    medidas: "",
    colores: "",
    dibujosSuela: "",
    cuadrante: "",
    figurasGeometricas: "",
    figurasSuperiorIzquierdo: [],
    figurasSuperiorDerecho: [],
    figurasCentral: [],
    figurasInferiorDerecho: [],
    figurasInferiorIzquierdo: [],
  });

  const [figuras, setFiguras] = useState([]);
  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);

  const fetchFiguras = () => {
    axios
      .get(API_URL_FORMAS)
      .then((response) => {
        const nombresFiguras = response.data.map(f => f.nombre);
        setFiguras(nombresFiguras);
      })
      .catch((error) => {
        console.error("Error al obtener figuras:", error);
      });
  };
  useEffect(() => {
    fetchFiguras();
  }, []);

  const obtenerIdForma = (nombreFigura) => {
    const figura = figuras.find((f) => f.nombre === nombreFigura);
    return figura ? figura.id_forma : null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit ejecutado");

    try {
      const calzadoRes = await axios.post(API_URL_CALZADOS, {
        categoria: formData.categoria,
        marca: formData.marca,
        modelo: formData.modelo,
        talle: formData.talle,
        medidas: formData.medidas,
        colores: formData.colores,
        tipo_registro: "dubitada",
        alto: 1,
        ancho: 1,
      });

      const id_calzado = calzadoRes.data.id_calzado;

      const detalles = [];

      const agregarDetalles = (figuras, id_cuadrante) => {
        figuras.forEach((nombreFigura) => {
          const id_forma = obtenerIdForma(nombreFigura);
          if (id_forma) {
            detalles.push({
              id_forma,
              id_cuadrante,
              detalle_adicional: "",
            });
          } else {
            console.warn(`⚠️ No se encontró ID para la figura "${nombreFigura}", se omitirá.`);
          }
        });
      };

      agregarDetalles(formData.figurasSuperiorIzquierdo, 1);
      agregarDetalles(formData.figurasSuperiorDerecho, 2);
      agregarDetalles(formData.figurasCentral, 3);
      agregarDetalles(formData.figurasInferiorIzquierdo, 4);
      agregarDetalles(formData.figurasInferiorDerecho, 5);

      await axios.post(API_URL_SUELAS, {
        id_calzado,
        descripcion_general: "Huella dubitada registrada",
        detalles,
      });

      alert("Huella dubitada registrada con éxito ✅");

      setFormData({
        categoria: "",
        marca: "",
        modelo: "",
        talle: "",
        medidas: "",
        colores: "",
        dibujosSuela: "",
        cuadrante: "",
        figurasGeometricas: "",
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

  const renderInput = (name, label, placeholder = "") => (
    <div key={name}>
      <label className="block text-sm font-semibold mb-1">{label}:</label>
      <input
        type="text"
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
        required
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );

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
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría:</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
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
        {renderInput("medidas", "Medidas", "Ej: 10cm x 5cm")}
        {renderInput("colores", "Colores", "Ej: Rojo, Azul")}
        {renderInput("dibujosSuela", "Dibujos de la Suela", "Ej: Ondas, Puntas")}

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-semibold mb-1">
            Cuadrante del calzado:
          </label>
          <select
            name="cuadrante"
            value={formData.cuadrante}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Seleccionar cuadrante</option>
            <option value="Superior Izquierdo">Superior Izquierdo</option>
            <option value="Superior Derecho">Superior Derecho</option>
            <option value="Central">Central</option>
            <option value="Inferior Izquierdo">Inferior Izquierdo</option>
            <option value="Inferior Derecho">Inferior Derecho</option>
          </select>
        </div>

        {renderInput("figurasGeometricas", "Figuras Geométricas", "Ej: Círculo, Cuadrado")}

        <label className="block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
        <FigurasDropdown
          title="Cuadrante Superior Izquierdo"
          options={figuras.map(f => f.nombre)}
          selectedOptions={formData.figurasSuperiorIzquierdo}
          onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorIzquierdo: selected }))}
        />
        <FigurasDropdown
          title="Cuadrante Superior Derecho"
          options={figuras.map(f => f.nombre)}
          selectedOptions={formData.figurasSuperiorDerecho}
          onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorDerecho: selected }))}
        />
        <FigurasDropdown
          title="Cuadrante Central"
          options={figuras.map(f => f.nombre)}
          selectedOptions={formData.figurasCentral}
          onChange={(selected) => setFormData(prev => ({ ...prev, figurasCentral: selected }))}
        />
        <FigurasDropdown
          title="Cuadrante Inferior Izquierdo"
          options={figuras.map(f => f.nombre)}
          selectedOptions={formData.figurasInferiorIzquierdo}
          onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorIzquierdo: selected }))}
        />
        <FigurasDropdown
          title="Cuadrante Inferior Derecho"
          options={figuras.map(f => f.nombre)}
          selectedOptions={formData.figurasInferiorDerecho}
          onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorDerecho: selected }))}
        />

        <button
          type="button"
          onClick={() => setMostrarFiguraForm(true)}
          className="mt-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md"
        >
          Nueva Figura
        </button>

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
