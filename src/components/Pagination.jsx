import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  filteredData,
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onItemsPerPageChange,
  getPageNumbers
}) => {
  if (filteredData.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
      <div className="text-xs sm:text-sm text-gray-700">
        Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredData.length)} de {filteredData.length} resultados
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <label className="text-xs sm:text-sm text-gray-700">Mostrar:</label>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className="border rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="text-xs sm:text-sm text-gray-700">por página</span>
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Botón anterior */}
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className={`p-1 sm:p-2 rounded-lg ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : page === '...'
                  ? "text-gray-400 cursor-default"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={`p-1 sm:p-2 rounded-lg ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination; 