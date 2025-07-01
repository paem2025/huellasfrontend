import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config/api";

const ModeloForm = ({ onClose, onUpdateModelos }) => {
  const [modelo, setModelo] = useState("");
  const [modelos, setModelos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const handleChange = (e) => {
    setModelo(e.target.value);
  };

  const fetchModelos = () => {
    axios
      .get(API_URLS.MODELOS)
      .then((res) => setModelos(res.data))
      .catch((error) => {
        console.error("Error al obtener modelos:", error);
      });
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URLS.MODELOS, { nombre: modelo })
      .then(() => {
        alert("Modelo cargado correctamente");
        setModelo("");
        fetchModelos();
        onUpdateModelos();
      })
      .catch((err) => {
        const mensaje = err.response?.data?.error || "Error al cargar modelo";
        alert(mensaje);
      });
  };

  const handleEditClick = (id, nombre) => {
    setEditId(id);
    setEditNombre(nombre);
  };

  const handleSaveEdit = () => {
    if (!window.confirm("¿Estás seguro de que deseas editar este modelo?")) {
      return;
    }
    axios
      .patch(`${API_URLS.MODELOS}${editId}`, { nombre: editNombre })
      .then(() => {
        alert("Modelo editado correctamente");
        setEditId(null);
        setEditNombre("");
        fetchModelos();
        onUpdateModelos();
      })
      .catch(() => {
        alert("Error al editar modelo");
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este modelo?")) {
      return;
    }
    axios
      .delete(`${API_URLS.MODELOS}${id}`)
      .then(() => {
        alert("Modelo eliminado correctamente");
        fetchModelos();
        onUpdateModelos();
      })
      .catch(() => {
        alert("Error al eliminar modelo");
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-semibold mb-1">Modelo:</label>

        <input
          type="text"
          value={modelo}
          onChange={handleChange}
          placeholder="Ingrese modelo"
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
                onUpdateModelos();
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
        <h2 className="text-sm font-semibold mb-4">Modelos cargados:</h2>

        {modelos.length === 0 && <p>No hay modelos cargados</p>}

        {modelos.length > 0 && (
          <ul className="list-disc list-inside">
            {modelos.map((m) => (
              <li
                key={m.id_modelo}
                className="flex items-center justify-between py-1 border-b last:border-b-0"
              >
                {editId === m.id_modelo ? (
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
                    <span>{m.nombre}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(m.id_modelo, m.nombre)}
                        className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(m.id_modelo)}
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

export default ModeloForm;