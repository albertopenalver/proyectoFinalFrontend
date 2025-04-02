/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
// eslint-disable-next-line react/prop-types
const DropdownProveedores = ({ onProveedorSeleccionado }) => {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  // Obtener los proveedores quieromail es true
  //const API_URL = import.meta.env.VITE_API_BASE_URL;
  const obtenerProveedoresConQuieroMail = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/proveedor`, {method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },});
      if (!response.ok) throw new Error("Error al obtener proveedores");
      const data = await response.json();
      // Filtrar solo los proveedores con quieremail = true
      const proveedoresFiltrados = data.filter((prov) => prov.quieremail === true);
      setProveedores(proveedoresFiltrados);
    } catch (err) {
      setError(err.message);
    }
  };
  // Cargar proveedores al montar el componente
  useEffect(() => {
    obtenerProveedoresConQuieroMail();
  }, []);
  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <select
          className="p-2 bg-base-100 border rounded"
          onChange={(e) => {
            const proveedorSeleccionado = proveedores.find((p) => p._id === e.target.value);
            if (onProveedorSeleccionado) onProveedorSeleccionado(proveedorSeleccionado);
          }}
        >
          <option value="">Seleccione un proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor._id} value={proveedor._id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
export default DropdownProveedores;