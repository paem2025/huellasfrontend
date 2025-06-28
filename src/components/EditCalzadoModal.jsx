import React from "react";
import FigurasDropdown from "./FigurasDropdown";

const EditCalzadoModal = ({
  editId,
  editCalzado,
  marcas,
  modelos,
  categorias,
  colores,
  onEditCalzadoChange,
  onSaveEdit,
  onCancelEdit
}) => {
  if (!editId) return null;

  const safeIdColores = Array.isArray(editCalzado.id_colores) ? editCalzado.id_colores : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl px-12 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Calzado</h2>
        <form onSubmit={e => { e.preventDefault(); onSaveEdit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <FigurasDropdown
                options={marcas.map(m => m.nombre)}
                selectedOptions={editCalzado.id_marca ? [marcas.find(m => m.id_marca === editCalzado.id_marca)?.nombre || ""] : []}
                onChange={(selected) => {
                  const selectedMarca = marcas.find(m => m.nombre === selected[0]);
                  onEditCalzadoChange({ target: { name: 'id_marca', value: selectedMarca?.id_marca || null } });
                }}
                multiple={false}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <FigurasDropdown
                options={modelos.map(m => m.nombre)}
                selectedOptions={editCalzado.id_modelo ? [modelos.find(m => m.id_modelo === editCalzado.id_modelo)?.nombre || ""] : []}
                onChange={(selected) => {
                  const selectedModelo = modelos.find(m => m.nombre === selected[0]);
                  onEditCalzadoChange({ target: { name: 'id_modelo', value: selectedModelo?.id_modelo || null } });
                }}
                multiple={false}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <FigurasDropdown
                options={categorias.map(c => c.nombre)}
                selectedOptions={editCalzado.id_categoria ? [categorias.find(c => c.id_categoria === editCalzado.id_categoria)?.nombre || ""] : []}
                onChange={(selected) => {
                  const selectedCategoria = categorias.find(c => c.nombre === selected[0]);
                  onEditCalzadoChange({ target: { name: 'id_categoria', value: selectedCategoria?.id_categoria || null } });
                }}
                multiple={false}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Registro</label>
              <FigurasDropdown
                options={["dubitada", "indubitada_proveedor", "indubitada_comisaria"]}
                selectedOptions={editCalzado.tipo_registro ? [editCalzado.tipo_registro] : []}
                onChange={(selected) => {
                  onEditCalzadoChange({ target: { name: 'tipo_registro', value: selected[0] || null } });
                }}
                multiple={false}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Colores</label>
              <FigurasDropdown
                options={colores.map(c => c.nombre)}
                selectedOptions={safeIdColores.map(id => colores.find(c => c.id_color === id)?.nombre).filter(Boolean)}
                onChange={(selected) => {
                  const selectedIds = (selected || []).map(name =>
                    colores.find(c => c.nombre === name)?.id_color
                  ).filter(Boolean);
                  onEditCalzadoChange({ target: { name: 'id_colores', value: selectedIds } });
                }}
                multiple={true}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Talle</label>
              <input
                type="text"
                name="talle"
                value={editCalzado.talle || ""}
                onChange={onEditCalzadoChange}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
              <input
                type="number"
                name="alto"
                value={editCalzado.alto || ""}
                onChange={onEditCalzadoChange}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
              <input
                type="number"
                name="ancho"
                value={editCalzado.ancho || ""}
                onChange={onEditCalzadoChange}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-semibold shadow"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCalzadoModal; 