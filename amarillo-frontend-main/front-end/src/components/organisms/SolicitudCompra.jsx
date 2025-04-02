/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import FiltroProducto from "../molecules/buscadorInventario.jsx";
import DropdownProveedores from "../atoms/dropdownproveedores.jsx";
import { jwtDecode } from "jwt-decode";


const SolicitudCompra = () => {
  const [show, setShow] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [solicitudRealizada, setSolicitudRealizada] = useState(false);
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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },});
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

  const enviarCorreoProveedor = async (email, cuerpoCorreo) => {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proveedorEmail: email,
          cuerpoCorreo: cuerpoCorreo,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Correo enviado correctamente al proveedor.");
      } else {
        alert("Error al enviar correo al proveedor: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("Hubo un problema al intentar enviar el correo.");
    }
  };

  const enviarSolicitudCompra = async () => {
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados.");
      return;
    }
    const cuerpoCorreo = productosSeleccionados
      .map((producto) => `<p><strong>${producto.nombre}</strong>: ${producto.cantidad} unidades</p>`)
      .join("");

    if (proveedorSeleccionado?.email) {
      await enviarCorreoProveedor(proveedorSeleccionado.email, cuerpoCorreo);
    }
    const productosMovimientos = productosSeleccionados.map((producto) => ({
      producto: producto._id,
      cantidadmov: producto.cantidad,
      tipo: "entrada",
      proveedor: proveedorSeleccionado?._id || null,
    }));

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: productosMovimientos, empresa: userEmpresa }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Movimientos registrados exitosamente.");
      } else {
        console.error("Error al registrar movimientos:", data.mensaje);
        alert("Error al registrar movimientos: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al registrar movimientos:", error);
      alert("Hubo un problema al registrar los movimientos en la base de datos.");
    }
    setSolicitudRealizada(true); 
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        <button
          onClick={() => setShow(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors my-7"
        >
          Crear nueva solicitud de compra
        </button>

        {productosSeleccionados.length > 0 && (
  <div className="flex flex-col sm:flex-row items-center justify-center mx-auto my-4 text-white space-y-4 sm:space-y-0 sm:space-x-4">
    <h2 className="text-lg font-semibold text-center sm:text-left">
      Seleccionar Proveedor (Opcional)
    </h2>
    <DropdownProveedores
      onProveedorSeleccionado={(proveedor) => setProveedorSeleccionado(proveedor)}
    />
  </div>
)}

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
          className="text-red-500 hover:underline"
        >
          Eliminar
        </button>
      </li>
    ))}
  </ul>
  {productosSeleccionados.length > 0 && (
    <button
      onClick={enviarSolicitudCompra}
      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 block mx-auto"
    >
      Confirmar Solicitud de Compra
    </button>
  )}
</div>


        {/* Mostrar mensaje de Solicitud Realizada */}
      {solicitudRealizada && (
        <div className="mt-4 text-green-500">
          <h3 className="font-semibold">¡Solicitud Realizada con éxito!</h3>

          <div className="mt-4">
          <h4 className="font-semibold">Productos seleccionados:</h4>
          <ul>
            {productosSeleccionados.map((producto) => (
              <li key={producto._id}>
              {producto.nombre}: {producto.cantidad} unidades
            </li>
            ))}
          </ul>
        </div>

    {proveedorSeleccionado?.nombre && (
      <div className="mt-4">
        <h4 className="font-semibold">Proveedor:</h4>
        <p>{proveedorSeleccionado.nombre}</p>
      </div>
    )}
  </div>
)}

        {show && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-neutral p-6 shadow-md rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 text-green-500 hover:text-gray-800 text-2xl"
              >
                &times;
              </button>

              <h1 className="text-3xl font-bold mb-4 text-white ">Seleccionar Productos</h1>

              <FiltroProducto onBuscar={buscarProductos} />

              {productos.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {productos.map((producto) => (
                    <div
                      key={producto._id}
                      className=" text-white flex items-center bg-base-100 p-4 rounded shadow"
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
                <p className="mt-4 text-gray-600">No se encontraron productos.</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShow(false)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
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

export default SolicitudCompra;
