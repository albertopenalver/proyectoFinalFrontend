/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import FiltroProducto from "../molecules/buscadorInventario.jsx";
import { jwtDecode } from "jwt-decode";

const Salida = () => {
  const [show, setShow] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [userEmpresa, setUserEmpresa]=useState("");

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {

      try {
        const decoded = jwtDecode(token); 
        const empresa = decoded.empresa
        setUserEmpresa (empresa)
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const mostrarProductos = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/product`, {method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', }, });
      const data = await response.json();
      setProductos(data);
      setProductosOriginales(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    mostrarProductos();
  }, []);

  const buscarProductos = (valorFiltro, filtroSeleccionado) => {
    if (!valorFiltro) {
      setProductos(productosOriginales);
    } else {
      const resultadosFiltrados = productosOriginales.filter((producto) => {
        switch (filtroSeleccionado) {
          case "nombre":
            return producto.nombre.toLowerCase().includes(valorFiltro.toLowerCase());
          case "id":
            return producto._id === valorFiltro;
          case "categoria":
            return (
              producto.categoria &&
              producto.categoria.nombre.toLowerCase().includes(valorFiltro.toLowerCase())
            );
          case "proveedor":
            return (
              producto.proveedor &&
              producto.proveedor.nombre.toLowerCase().includes(valorFiltro.toLowerCase())
            );
          default:
            return true;
        }
      });
      setProductos(resultadosFiltrados);
    }
  };

  const manejarSeleccionProducto = (producto) => {
    setProductosSeleccionados((prevSeleccionados) => {
      if (prevSeleccionados.find((p) => p._id === producto._id)) {
        return prevSeleccionados.filter((p) => p._id !== producto._id);
      } else {
        return [...prevSeleccionados, { ...producto, cantidad: 0 }];
      }
    });
  };

  const manejarCambioCantidad = (idProducto, cantidad) => {
    setProductosSeleccionados((prevSeleccionados) =>
      prevSeleccionados.map((producto) =>
        producto._id === idProducto ? { ...producto, cantidad: parseInt(cantidad) || 0 } : producto
      )
    );
  };

  const enviarProductos = async () => {
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados.");
      return;
    }

    const movimientos = productosSeleccionados.map((producto) => ({
      producto: producto._id,
      cantidadmov: producto.cantidad,
      tipo: "salida",
    }));

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: movimientos, empresa: userEmpresa }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movimientos registrados exitosamente");
        setProductosSeleccionados([]);
      } else {
        alert("Error al registrar movimientos: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al enviar movimientos:", error);
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        <button
          onClick={() => setShow(true)}
          className="bg-secondary text-black py-2 px-4 rounded-lg hover:bg-primary transition-colors my-7"
        >
          Crear nueva salida
        </button>
  
        <div className="mt-6">
          {productosSeleccionados.length > 0 && (
            <h2 className="text-white text-center mb-4">Productos Seleccionados:</h2>
          )}
          <ul className="space-y-4">
            {productosSeleccionados.map((producto) => (
              <li
                key={producto._id}
                className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 text-white bg-neutral p-4 rounded-lg shadow"
              >
                <p className="text-center sm:text-left">
                  {producto.nombre} - ID: {producto._id}
                </p>
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={producto.cantidad}
                  onChange={(e) => manejarCambioCantidad(producto._id, e.target.value)}
                  className="border bg-base-100 p-2 rounded text-white"
                />
                <button
                  onClick={() => manejarSeleccionProducto(producto)}
                  className="text-error hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          {productosSeleccionados.length > 0 && (
            <button
              onClick={enviarProductos}
              className="mt-4 bg-info text-black py-2 px-4 rounded-lg hover:bg-primary block mx-auto transition-colors"
            >
              Confirmar Salida
            </button>
          )}
        </div>
  
        {show && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-base-100 p-6 shadow-md rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 text-error hover:text-neutral-300 text-2xl"
              >
                &times;
              </button>
              <h1 className="text-3xl font-bold mb-4 text-white">Seleccionar Productos</h1>
              <FiltroProducto onBuscar={buscarProductos} />
              {productos.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {productos.map((producto) => (
                    <div
                      key={producto._id}
                      className="flex items-center bg-neutral p-4 rounded shadow"
                    >
                      <input
                        type="checkbox"
                        onChange={() => manejarSeleccionProducto(producto)}
                        className="mr-4"
                      />
                      <div className="text-white">
                        <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                        <p>ID: {producto._id}</p>
                        {producto.categoria && <p>Categoría: {producto.categoria.nombre}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-neutral-400">No se encontraron productos.</p>
              )}
  
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShow(false)}
                  className="bg-success text-black py-2 px-4 rounded-lg hover:bg-primary transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Salida;
