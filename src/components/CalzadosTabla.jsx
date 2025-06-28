import React from "react";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const CalzadosTabla = ({ 
  currentItems, 
  onEditClick, 
  onDeleteClick, 
  onViewSuela 
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Marca
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Modelo
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Talle
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Medidas
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Colores
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Categoría
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tipo
            </th>
            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentItems.map((calzado) => (
            <tr key={calzado.id} className="hover:bg-gray-50">
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 capitalize">
                {calzado.marca}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                {calzado.modelo}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                {calzado.talle}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900">
                {calzado.medidas}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 capitalize">
                {calzado.colores}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 capitalize">
                {calzado.categoria}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 capitalize">
                {calzado.tipo === "dubitada"
                  ? "Dubitada"
                  : calzado.tipo === "indubitada_proveedor"
                  ? "Indubitada (Proveedor)"
                  : calzado.tipo === "indubitada_comisaria"
                  ? "Indubitada (Comisaría)"
                  : calzado.tipo}
              </td>
              <td className="px-3 sm:px-6 py-2 sm:py-4 flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => onEditClick(calzado)}
                  className="text-yellow-600 hover:text-yellow-900"
                  title="Editar"
                >
                  <FiEdit size={16} />
                </button>
                <button
                  onClick={() => onDeleteClick(calzado.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <FiTrash2 size={16} />
                </button>
                <button
                  onClick={() => onViewSuela(calzado.id)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Ver suela"
                >
                  <FiEye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalzadosTabla;