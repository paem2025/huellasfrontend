import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config/api";

const ColorForm = ({ onClose, onUpdateColores }) => {
  const [color, setColor] = useState("");
  const [colores, setColores] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const handleChange = (e) => {
    setColor(e.target.value);
  };

  const fetchColores = () => {
    axios
      .get(API_URLS.COLORES)
      .then((res) => {
        setColores(res.data);
      })
      .catch((error) => {
        console.error("Error al obtener colores:", error);
      });
  };

  useEffect(() => {
    fetchColores();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URLS.COLORES, { nombre: color })
      .then(() => {
        alert("Color cargado correctamente");
        setColor("");
        fetchColores();
        onUpdateColores();
      })
      .catch(() => {
        alert("Error al cargar color");
      });
  };

  const handleEditClick = (id, nombre) => {
    setEditId(id);
    setEditNombre(nombre);
  };

  const handleSaveEdit = () => {
    if (!window.confirm("¿Estás seguro de que deseas editar este color?")) {
      return;
    }
    axios
      .patch(`${API_URLS.COLORES}${editId}`, { nombre: editNombre })
      .then(() => {
        alert("Color editado correctamente");
        setEditId(null);
        setEditNombre("");
        fetchColores();
        onUpdateColores();
      })
      .catch(() => {
        alert("Error al editar color");
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este color?")) {
      return;
    }
    axios
      .delete(`${API_URLS.COLORES}${id}`)
      .then(() => {
        alert("Color eliminado correctamente");
        fetchColores();
        onUpdateColores();
      })
      .catch(() => {
        alert("Error al eliminar color");
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-semibold mb-1">Color:</label>

        <input
          type="text"
          value={color}
          onChange={handleChange}
          placeholder="Ingrese color"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Guardar
          </button>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                onUpdateColores();
                onClose();
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
            >
              Volver
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto mt-6">
        <h2 className="text-sm font-semibold mb-4">Colores cargados:</h2>

        {colores.length === 0 && <p>No hay colores cargados</p>}

        {colores.length > 0 && (
          <ul className="list-disc list-inside">
            {colores.map((c) => (
              <li
                key={c.id_color}
                className="flex items-center justify-between py-1 border-b last:border-b-0"
              >
                {editId === c.id_color ? (
                  <>
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <div className="space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                        type="button"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{c.nombre}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(c.id_color, c.nombre)}
                        className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id_color)}
                        className="bg-red-600 text-white text-sm px-2 py-0.5 rounded hover:bg-red-700"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ColorForm;