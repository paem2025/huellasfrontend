import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
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
    colores: "",
    descripcion_general: "",
    //Arrays que guardan las figuras de cada cuadrante
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const calzadoRes = await axios.post(API_URLS.CALZADOS, {
        categoria: formData.categoria,
        marca: formData.marca,
        modelo: formData.modelo,
        talle: formData.talle,
        alto: formData.alto,
        ancho: formData.ancho,
        colores: formData.colores,
        tipo_registro: "indubitada_comisaria",
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
              detalle_adicional: ""
            });
          }
        });
      };

      agregarDetalles(formData.figurasSuperiorIzquierdo, 1);
      agregarDetalles(formData.figurasSuperiorDerecho, 2);
      agregarDetalles(formData.figurasInferiorIzquierdo, 3);
      agregarDetalles(formData.figurasInferiorDerecho, 4);
      agregarDetalles(formData.figurasCentral, 5);

      await axios.post(API_URLS.SUELAS, {
        id_calzado,
        descripcion_general: formData.descripcion_general || 
          `Huella indubitada registrada por ${formData.comisaria} (${formData.jurisdiccion}) - ${formData.nombre} ${formData.apellido} (DNI: ${formData.dni})`,
        detalles
      });

      alert("Huella indubitada registrada con éxito ✅");

      // Reset
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
        nombre: "",
        apellido: "",
        dni: "",
        comisaria: "",
        jurisdiccion: "",
      });

    } catch (error) {
      console.error("Error al registrar huella indubitada:", error);
      alert("❌ Error al registrar huella indubitada");
    }
  };

  //Estado para figuras
  const [figuras, setFiguras] = useState([]);

  const fetchFiguras = () => {
    axios
      .get(API_URLS.FORMAS)
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

  const fields = [
    { name: "categoria", label: "Categoría", type: "select", options: ["Deportivo", "Urbano", "Trabajo"] },
    { name: "marca", label: "Marca" },
    { name: "modelo", label: "Modelo" },
    { name: "talle", label: "Talle" },
    { name: "alto", label: "Alto" },
    { name: "ancho", label: "Ancho" },
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
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto transition hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
        Registrar Huella Indubitada (Comisarías)
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Datos del calzado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Datos del Calzado</h3>
            {fields.slice(0, 7).map(({ name, label, type, options }) => (
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
                    type="text"
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
          </div>

          {/* Datos internos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-600">Datos internos</h3>
            {fields.slice(7).map(({ name, label }) => (
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
        </div>

        
        {/* Seleccionaon de figuras por cuadrante */}
          <div>
            <label className = "block text-sm font-semibold mb-3 capitalize">Figuras de la Suela:</label>
              <FigurasDropdown title="Cuadrante Superior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorIzquierdo: selected }))} />
              <FigurasDropdown title="Cuadrante Superior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasSuperiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasSuperiorDerecho: selected }))} />
              <FigurasDropdown title="Cuadrante Central" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasCentral} onChange={(selected) => setFormData(prev => ({ ...prev, figurasCentral: selected }))} />
              <FigurasDropdown title="Cuadrante Inferior Izquierdo" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorIzquierdo} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorIzquierdo: selected }))} />
              <FigurasDropdown title="Cuadrante Inferior Derecho" options={figuras.map(f => f.nombre)} selectedOptions={formData.figurasInferiorDerecho} onChange={(selected) => setFormData(prev => ({ ...prev, figurasInferiorDerecho: selected }))} />
       
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


export default IndubitadasComisaria;