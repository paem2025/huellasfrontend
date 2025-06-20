// src/pages/IndubitadasComisaria.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";

const API_URL_FORMAS = "http://127.0.0.1:5000/formas/";
const API_URL_CALZADOS = "http://127.0.0.1:5000/calzados/";
const API_URL_SUELAS = "http://127.0.0.1:5000/suelas/";

const IndubitadasComisaria = () => {
  const [formData, setFormData] = useState({
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
    nombre: "",
    apellido: "",
    dni: "",
    comisaria: "",
    jurisdiccion: "",
  });

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);
  const [figuras, setFiguras] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL_FORMAS)
      .then((res) => setFiguras(res.data))
      .catch((error) => {
        console.error("Error al obtener figuras:", error);
      });
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

    try {
      const calzadoRes = await axios.post(API_URL_CALZADOS, {
        categoria: "N/A",
        marca: formData.marca,
        modelo: formData.modelo,
        talle: formData.talle,
        medidas: formData.medidas,
        colores: formData.colores,
        tipo_registro: "indubitada_comisaria",
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
        descripcion_general: `Registro de huella de ${formData.nombre} ${formData.apellido} - Comisaría ${formData.comisaria}`,
        detalles,
      });

      alert("Huella indubitada registrada (comisaría) ✅");

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
        nombre: "",
        apellido: "",
        dni: "",
        comisaria: "",
        jurisdiccion: "",
      });
    } catch (error) {
      console.error("Error al registrar huella indubitada (comisaría):", error);
      alert("❌ Error al registrar huella indubitada (comisaría)");
    }
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
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl mx-auto transition hover:shadow-2xl">
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

        <div>
          <label className="block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
          {[
            { title: "Cuadrante Superior Izquierdo", name: "figurasSuperiorIzquierdo" },
            { title: "Cuadrante Superior Derecho", name: "figurasSuperiorDerecho" },
            { title: "Cuadrante Central", name: "figurasCentral" },
            { title: "Cuadrante Inferior Izquierdo", name: "figurasInferiorIzquierdo" },
            { title: "Cuadrante Inferior Derecho", name: "figurasInferiorDerecho" },
          ].map(({ title, name }) => (
            <FigurasDropdown
              key={name}
              title={title}
              options={figuras.map(f => f.nombre)}
              selectedOptions={formData[name]}
              onChange={(selected) =>
                setFormData(prev => ({ ...prev, [name]: selected }))
              }
            />
          ))}
        </div>

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
