import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";

const API_URL_FORMAS = "http://127.0.0.1:5000/formas/";
const API_URL_CALZADOS = "http://127.0.0.1:5000/calzados/";
const API_URL_SUELAS = "http://127.0.0.1:5000/suelas/";

const Indubitadas = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    talle: "",
    alto: "",
    ancho: "",
    colores: "",
    //Arrays que guardan las figuras de cada cuadrante
    figurasSuperiorIzquierdo: [],
    figurasSuperiorDerecho: [],
    figurasInferiorDerecho: [],
    figurasInferiorIzquierdo: [],
    figurasCentral: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const obtenerIdForma = (nombreFigura) => {
    const figura = figuras.find((f) => f.nombre === nombreFigura);
    return figura ? figura.id_forma : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const calzadoRes = await axios.post(API_URL_CALZADOS, {
        categoria: "N/A",
        marca: formData.marca,
        modelo: formData.modelo,
        talle: formData.talle,
        alto: formData.alto,
        ancho: formData.ancho,
        colores: formData.colores,
        tipo_registro: "indubitada_proveedor",
      });

      const id_calzado = calzadoRes.data.id_calzado;

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
        descripcion_general: "Huella indubitada registrada",
        detalles,
      });

      alert("Huella indubitada registrada con éxito ✅");

      setFormData({
        marca: "",
        modelo: "",
        talle: "",
        alto: "",
        ancho: "",
        colores: "",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorDerecho: [],
        figurasInferiorIzquierdo: [],
      });
    } catch (error) {
      console.error("Error al registrar huella indubitada:", error);
      alert("❌ Error al registrar huella indubitada");
    }
  };

  //Reemplazar formulario Indubitadas por FiguraForm si mostrarFiguraForm es igual a true
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
          {["marca", "modelo", "talle", "alto", "ancho", "colores"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-1 capitalize">{field}:</label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Ingrese ${field}`}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />  
            </div>
          ))}

          {/* Seleccionaon de figuras por cuadrante */}
          <div>
            <label className = "block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
              <FigurasDropdown title="Cuadrante Superior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorIzquierdo: selected }))} />
              <FigurasDropdown title="Cuadrante Superior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorDerecho: selected }))} />
              <FigurasDropdown title="Cuadrante Central" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasCentral} onChange={(selected) => setFormData(prev => ({ ...prev, figurasCentral: selected }))} />
              <FigurasDropdown title="Cuadrante Inferior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorIzquierdo: selected }))} />
              <FigurasDropdown title="Cuadrante Inferior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorDerecho: selected }))} />
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
