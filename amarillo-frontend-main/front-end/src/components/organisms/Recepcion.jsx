/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import FiltroProducto from "../molecules/buscadorInventario.jsx";
import Navbar from "../molecules/Navegador.jsx";
import { jwtDecode } from "jwt-decode";
import Salida from "../organisms/Salida.jsx";
import Solicitud from "../organisms/SolicitudCompra.jsx";
import Footer from "../molecules/footer.jsx"

const Recepcion = () => {
  const [show, setShow] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [userEmpresa, setUserEmpresa]=useState("")
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/product`, {method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },});
      const data = await response.json();
      setProductos(data);
      setProductosOriginales(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
    setLoading(false);
  };

  const mostrarMovimientos = async () => {
    setLoading(true);
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos`, {method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },});
      const data = await response.json();
      setMovimientos(data.movimientos.filter(mov => mov.tipo === "entrada")); // Filtrar solo los de tipo "entrada"
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    mostrarProductos();
    mostrarRecepcionesPendientes()
  }, []);

  const mostrarRecepcionesPendientes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos`, {method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },});
      const data = await response.json();
      setMovimientos(data);

      const movimientosAgrupados = data.map((guardarMovimiento) => ({
        id: guardarMovimiento._id,
        movimientos: guardarMovimiento.movimiento.map((mov) => ({
          id: mov._id,
          producto: mov.producto?.nombre || "N/A",
          cantidad: mov.cantidadmov,
          fecha: mov.createdAt,
        })),
      }));
      setMovimientos(movimientosAgrupados);
    } catch (error) {
      console.error("Error al obtener recepciones pendientes:", error);
    }
    setLoading(false);
  };

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
  const cambiarEstadoMovimiento = async (idMovimiento, nuevoEstado) => {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idMovimiento, nuevoEstado }),
      });
      if (response.ok) {
        alert(`Movimiento ${nuevoEstado} exitosamente.`);
        mostrarRecepcionesPendientes();
      } else {
        const data = await response.json();
        alert("Error al cambiar estado: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al cambiar estado del movimiento:", error);
      alert("Error al cambiar estado del movimiento.");
    }
  };

  const enviarProductos = async () => {
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados.");
      return;
    }
    const movimientos = productosSeleccionados.map((producto) => ({
      producto: producto._id,
      cantidadmov: producto.cantidad,
      tipo: "entrada",
    
    }));
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: movimientos, empresa: userEmpresa } ),
      });
      if (response.ok) {
        alert("Movimientos registrados exitosamente.");
        mostrarMovimientos();
      } else {
        const data = await response.json();
        alert("Error al registrar movimientos: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al enviar movimientos:", error);
      alert("Error al registrar movimientos.");
    }
  };
  return (
  <div className="bg-base-100 min-h-screen text-neutral ">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="border-neutral h-20 w-20 animate-spin rounded-full border-8 border-t-primary mx-auto my-12"></div>
      ) : (
        <>
          {/* Contenedor de Solicitud y Salida */}
          <div className="flex flex-col bg-neutral rounded-xl md:flex-row justify-center items-center  ">
            <Solicitud />
            <Salida />
          </div>

          {/* Productos seleccionados */}
          <div className="mt-6">
            {productosSeleccionados.length > 0 && (
              <h2 className="text-xl font-semibold mb-4">Productos Seleccionados:</h2>
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productosSeleccionados.map((producto) => (
                <li
                  key={producto._id}
                  className="flex flex-col sm:flex-row items-center bg-gray-800 p-4 rounded-lg"
                >
                  <p className="flex-grow mb-2 sm:mb-0 sm:mr-4">
                    {producto.nombre} - <span className="font-semibold">ID:</span> {producto._id}
                  </p>
                  <div className="flex space-x-2 items-center">
                    <input
                      type="number"
                      placeholder="Cantidad"
                      value={producto.cantidad}
                      onChange={(e) => manejarCambioCantidad(producto._id, e.target.value)}
                      className="border p-2 rounded text-black w-20"
                    />
                    <button
                      onClick={() => manejarSeleccionProducto(producto)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {productosSeleccionados.length > 0 && (
              <button
                onClick={enviarProductos}
                className="mt-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Confirmar Recepción
              </button>
            )}
          </div>

          {/* Historial de movimientos */}
          <div className="mt-12">
            <h2 className="text-2xl text-primary font-bold mb-4">Historial de Movimientos</h2>
            {movimientos.length > 0 ? (
              movimientos.map((conjunto, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Conjunto ID: {conjunto.id}
                  </h3>
                  <div className=" overflow-x-auto">
                    <table className=" rounded-xl w-full border-collapse  bg-neutral text-gray-200 ">
                      <thead className="hidden sm:table-header-group">
                        <tr>
                      <th className="  border  px-4 py-2">Producto</th>
                        <th className=" border  px-4 py-2">Cantidad</th>
                        <th className=" border  px-4 py-2">Fecha</th>
                        <th className=" border  px-4 py-2">Tipo</th>
                        <th className=" border  px-4 py-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conjunto.movimientos.map((movimiento) => (
                          <tr
                            key={movimiento.id}
                            className=" sm:table-row rounded-xl sm:border-none"
                          >
                            {/* Modo apilado en pantallas pequeñas */}
                            <td className="sm:hidden p-4 ">
                              <div className="flex flex-col  space-y-2">
                                <p>
                                  <span className="font-semibold">Producto:</span> {movimiento.producto}
                                </p>
                                <p>
                                  <span className="font-semibold">Cantidad:</span> {movimiento.cantidad}
                                </p>
                                <p>
                                  <span className="font-semibold">Fecha:</span>{" "}
                                  {new Date(movimiento.fecha).toLocaleString()}
                                </p>
                                <p>
                                  <span className="font-semibold">Tipo:</span> {movimiento.tipo}
                                </p>
                                <p>
                                  <span className="font-semibold">Estado:</span>{" "}
                                  {movimiento.estado === "pendiente" ? (
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() =>
                                          cambiarEstadoMovimiento(movimiento.id, "aprobado")
                                        }
                                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                      >
                                        Aprobar
                                      </button>
                                      <button
                                        onClick={() =>
                                          cambiarEstadoMovimiento(movimiento.id, "rechazado")
                                        }
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                      >
                                        Rechazar
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      className={`px-2 py-1 rounded ${
                                        movimiento.estado === "aprobado"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {movimiento.estado}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </td>
                            {/* Modo tabla en pantallas grandes */}
                            <td className="border hidden sm:table-cell  rounded-xl px-4 py-2">
                              {movimiento.producto}
                            </td>
                            <td className=" border hidden sm:table-cell  rounded-xl px-4 py-2">
                              {movimiento.cantidad}
                            </td>
                            <td className=" border hidden sm:table-cell  rounded-xl px-4 py-2">
                              {new Date(movimiento.fecha).toLocaleString()}
                            </td>
                            <td className=" border hidden sm:table-cell  rounded-xl px-4 py-2">
                              {movimiento.tipo}
                            </td>
                            <td className=" border hidden sm:table-cell  rounded-xl px-4 py-2">
                              {movimiento.estado === "pendiente" ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => cambiarEstadoMovimiento(movimiento.id, "aprobado")}
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => cambiarEstadoMovimiento(movimiento.id, "rechazado")}
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                  >
                                    Rechazar
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className={`px-2 py-1 rounded ${
                                    movimiento.estado === "aprobado"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {movimiento.estado}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay recepciones pendientes.</p>
            )}
          </div>

          {/* Modal */}
          {show && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-gray-800 text-gray-100 p-6 shadow-md rounded-lg max-w-full sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                <button
                  onClick={() => setShow(false)}
                  className="absolute top-4 right-4 text-red-500 hover:text-gray-300 text-2xl"
                >
                  &times;
                </button>
                <h1 className="text-3xl font-bold mb-4">Seleccionar Productos</h1>
                <FiltroProducto onBuscar={buscarProductos} />
                {productos.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productos.map((producto) => (
                      <div
                        key={producto._id}
                        className="flex items-center bg-gray-700 p-4 rounded-lg shadow"
                      >
                        <input
                          type="checkbox"
                          onChange={() => manejarSeleccionProducto(producto)}
                          className="mr-4"
                        />
                        <div>
                          <h2 className="text-lg font-semibold">{producto.nombre}</h2>
                          <p>ID: {producto._id}</p>
                          {producto.categoria && <p>Categoría: {producto.categoria.nombre}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-gray-400">No se encontraron productos.</p>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShow(false)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    <Footer/>
  </div>
);
  
  
  
};
export default Recepcion;