import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";

const Indubitadas = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    talle: "",
    medidas: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Huella registrada correctamente");
    setFormData({
      marca: "",
      modelo: "",
      talle: "",
      medidas: "",
      colores: "",
      figurasSuperiorIzquierdo: [],
      figurasSuperiorDerecho: [],
      figurasCentral: [],
      figurasInferiorDerecho: [],
      figurasInferiorIzquierdo: [],
    });
  };

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);

  //Array de figuras de ejemplo, cambiar por el array real traido por el endpoint
  const exampleFigures = ["Figura1", "Figura2", "Figura3"];

  //Reemplazar formulario Indubitadas por FiguraForm si mostrarFiguraForm es igual a true
  if (mostrarFiguraForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FiguraForm onClose={() => setMostrarFiguraForm(false)} />
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
          {["marca", "modelo", "talle", "medidas", "colores"].map((field) => (
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
            <FigurasDropdown
              title="Cuadrante Superior Izquierdo" 
              options={exampleFigures} 
              selectedOptions={formData.figurasSuperiorIzquierdo} 
              onChange={(selectedFigures) => setFormData(prev => ({ ...prev, figurasSuperiorIzquierdo: selectedFigures }))}
            />
            <FigurasDropdown
              title="Cuadrante Superior Derecho" 
              options={exampleFigures} 
              selectedOptions={formData.figurasSuperiorDerecho} 
              onChange={(selectedFigures) => setFormData(prev => ({ ...prev, figurasSuperiorDerecho: selectedFigures }))}
            />
            <FigurasDropdown
              title="Cuadrante Central" 
              options={exampleFigures} 
              selectedOptions={formData.figurasCentral} 
              onChange={(selectedFigures) => setFormData(prev => ({ ...prev, figurasCentral: selectedFigures}))} 
            />
            <FigurasDropdown
              title="Cuadrante Inferior Izquierdo" 
              options={exampleFigures} 
              selectedOptions={formData.figurasInferiorIzquierdo} 
              onChange={(selectedFigures) => setFormData(prev => ({ ...prev, figurasInferiorIzquierdo: selectedFigures}))} 
            />
            <FigurasDropdown
              title="Cuadrante Inferior Derecho" 
              options={exampleFigures} 
              selectedOptions={formData.figurasInferiorDerecho} 
              onChange={(selectedFigures) => setFormData(prev => ({ ...prev, figurasInferiorDerecho: selectedFigures}))} 
            />

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
