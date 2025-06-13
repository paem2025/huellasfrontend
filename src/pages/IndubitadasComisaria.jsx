import React, { useState } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import HuellaForm from "../components/HuellaForm";

const IndubitadasComisaria = () => {
  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    talle: "",
    medidas: "",
    colores: "",
    nombre: "",
    apellido: "",
    dni: "",
    comisaria: "",
    jurisdiccion: "",
    figuras: {
      superiorIzquierdo: [],
      superiorDerecho: [],
      central: [],
      inferiorIzquierdo: [],
      inferiorDerecho: [],
    },
  });

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos ingresados:", formData);
    // Aquí podrías agregar lógica de envío al backend
    setFormData({
      marca: "",
      modelo: "",
      talle: "",
      medidas: "",
      colores: "",
      nombre: "",
      apellido: "",
      dni: "",
      comisaria: "",
      jurisdiccion: "",
      figuras: {
        superiorIzquierdo: [],
        superiorDerecho: [],
        central: [],
        inferiorIzquierdo: [],
        inferiorDerecho: [],
      },
    });
  };

  const fields = [
    { name: "marca", label: "Marca" },
    { name: "modelo", label: "Modelo" },
    { name: "talle", label: "Talle" },
    { name: "medidas", label: "Medidas (Alto x Ancho)" },
    { name: "colores", label: "Colores" },
    { name: "nombre", label: "Nombre" },
    { name: "apellido", label: "Apellido" },
    { name: "dni", label: "DNI" },
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
        <FiguraForm onClose={() => setMostrarFiguraForm(false)} />
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto transition hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Registrar Huella Indubitada (Comisarías)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-semibold mb-1">
              {label}:
            </label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={`Ingrese ${label.toLowerCase()}`}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>
        ))}

        <label className="block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
        <HuellaForm figuras={formData.figuras} setFiguras={(nuevas) => setFormData(prev => ({ ...prev, figuras: nuevas }))} />

        <button
          type="button"
          onClick={() => setMostrarFiguraForm(true)}
          className="mt-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition duration-300 shadow-md"
        >
          Nueva Figura
        </button>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition duration-300 shadow-md"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default IndubitadasComisaria;
