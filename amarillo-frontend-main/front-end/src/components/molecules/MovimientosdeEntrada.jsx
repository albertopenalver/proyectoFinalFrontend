/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

const MovimientosEntrada = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMovimientosEntrada = async () => {
      try {
        const response = await fetch(`https://amarillo-backend.onrender.com/movimientos?tipo=entrada`);
        if (!response.ok) {
          throw new Error(`Error al obtener movimientos: ${response.statusText}`);
        }
        const data = await response.json();
        setMovimientos(data.movimientos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientosEntrada();
  }, []);

  if (loading) return <p>Cargando movimientos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Movimientos de Entrada</h1>
      <ul>
        {movimientos.map((movimiento) => (
          <li key={movimiento._id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <p><strong>Producto:</strong> {movimiento.producto.nombre || 'N/A'}</p>
            <p><strong>Cantidad:</strong> {movimiento.cantidadmov}</p>
            <p><strong>Proveedor:</strong> {movimiento.proveedor ? movimiento.proveedor.nombre : 'No especificado'}</p>
            <p><strong>Fecha:</strong> {new Date(movimiento.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovimientosEntrada;
