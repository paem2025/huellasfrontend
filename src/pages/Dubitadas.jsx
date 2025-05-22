// src/pages/Dubitadas.jsx
import React, { useState } from "react";

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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos ingresados:", formData);
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
    });
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
          <label className="block text-sm font-semibold mb-1">Cuadrante del calzado:</label>
          <select
            name="cuadrante"
            value={formData.cuadrante}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Superior Izquierdo">Superior Izquierdo</option>
            <option value="Superior Derecho">Superior Derecho</option>
            <option value="Central">Central</option>
            <option value="Inferior Izquierdo">Inferior Izquierdo</option>
            <option value="Inferior Derecho">Inferior Derecho</option>
            
          </select>
        </div>

        {renderInput("figurasGeometricas", "Figuras Geométricas", "Ej: Círculo, Cuadrado")}

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
