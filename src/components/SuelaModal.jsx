import React from "react";

const SuelaModal = ({
  suelaData,
  editSuela,
  setEditSuela,
  onGuardarSuela,
  onClose
}) => {
  if (!suelaData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Suela del Calzado</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción General
          </label>
          <textarea
            value={editSuela}
            onChange={(e) => setEditSuela(e.target.value)}
            rows={4}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onGuardarSuela}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuelaModal; 