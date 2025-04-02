
import { useState } from 'react';
/* eslint-disable react/prop-types */

const FiltroProducto = ({ onBuscar }) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('');
  const [valorFiltro, setValorFiltro] = useState('');

  const toggleDropdown = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const manejarCambioFiltro = (e) => {
    setValorFiltro(e.target.value);
  };

  const manejarBusqueda = () => {
    onBuscar(valorFiltro, filtroSeleccionado); // Llama a la función onBuscar pasándole el valor actual del filtro
    setValorFiltro('');
    setMostrarFiltros(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Filtrar
      </button>

      {mostrarFiltros && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <button
            onClick={() => {
              setFiltroSeleccionado('nombre');
              setMostrarFiltros(false);
            }}
            className="block w-full text-left px-4 py-2 bg-base-300 hover:bg-gray-200"
          >
            Buscar por Nombre
          </button>
          <button
            onClick={() => {
              setFiltroSeleccionado('id');
              setMostrarFiltros(false);
            }}
            className="block w-full text-left px-4 py-2 bg-base-300 hover:bg-gray-200"
          >
            Buscar por ID
          </button>
          <button
            onClick={() => {
              setFiltroSeleccionado('categoria');
              setMostrarFiltros(false); 
            }}
            className="block w-full text-left px-4 py-2 bg-base-300 hover:bg-gray-200"
          >
            Buscar por Categoría
          </button>
          <button
            onClick={() => {
              setFiltroSeleccionado('proveedor');
              setMostrarFiltros(false); 
            }}
            className="block w-full text-left px-4 py-2 bg-base-300 hover:bg-gray-200"
          >
            Buscar por proveedor
          </button>
        </div>
      )}
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder={`Introduce ${filtroSeleccionado}`}
            value={valorFiltro}
            onChange={manejarCambioFiltro}
            className="border p-2 bg-base-300 rounded mb-2 w-full"
          />
          <button
            onClick={manejarBusqueda}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Buscar
          </button>
        </div> 
    </div>
  );
};

export default FiltroProducto;

