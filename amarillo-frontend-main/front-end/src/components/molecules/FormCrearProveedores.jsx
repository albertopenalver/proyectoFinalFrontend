/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  

const Proveedores = () => {

  const [proveedores, setProveedores] = useState([]); 
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null); 
  const [mostrarLista, setMostrarLista] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    cif: "",
    quieremail: false,
    email: "",
    direccion: "",
    telefono: "",
  });
  const [userEmpresa, setUserEmpresa]=useState("");

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

 
   useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const empresa = decoded.empresa;
        setUserEmpresa(empresa);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  
  const obtenerProveedores = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/proveedor`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };


  const manejarEnvioFormulario = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const metodo = proveedorSeleccionado ? "PUT" : "POST";
    const url = proveedorSeleccionado
      ? `https://amarillo-backend.onrender.com/proveedor/${proveedorSeleccionado._id}`
      : `https://amarillo-backend.onrender.com/proveedor`;

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData, empresa: userEmpresa}),
      });

      if (response.ok) {
        obtenerProveedores(); 
        setFormData({
          nombre: "",
          cif: "",
          quieremail: false,
          email: "",
          direccion: "",
          telefono: "",
        });
        setProveedorSeleccionado(null);
      } else {
        console.error("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error al crear/editar proveedor:", error);
    }
  };


  const manejarEditarProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      cif: proveedor.cif,
      quieremail: proveedor.quieremail || false,
      email: proveedor.email,
      direccion: proveedor.direccion,
      telefono: proveedor.telefono,
    });
  };


  const eliminarProveedor = async (id) => {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/proveedor/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        obtenerProveedores();
      } else {
        console.error("Error al eliminar el proveedor");
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
    }
  };


  const manejarCambioFormulario = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  useEffect(() => {
    obtenerProveedores();
  }, []);

 return (
  <div className="bg-base-100 text-base-content rounded-xl min-h-screen p-6">
  
    <h2 className="text-3xl font-bold text-center mb-6 text-primary">Proveedores</h2>

 
    <form 
      onSubmit={manejarEnvioFormulario} 
      className="bg-neutral p-4 rounded-lg mb-6 grid gap-4 sm:grid-cols-2"
    >
      <div className="col-span-2">
        <label className="text-lg font-bold">Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={manejarCambioFormulario}
          className="bg-base-100 text-base-content w-full p-2 rounded-md border border-gray-700"
          required
        />
      </div>
      <div>
        <label className="text-lg font-bold">CIF:</label>
        <input
          type="text"
          name="cif"
          value={formData.cif}
          onChange={manejarCambioFormulario}
          className="bg-base-100 text-base-content w-full p-2 rounded-md border border-gray-700"
        />
      </div>
      <div>
        <label className="text-lg font-bold">Enviar pedidos por mail:</label>
        <input
          type="checkbox"
          name="quieremail"
          checked={formData.quieremail}
          onChange={manejarCambioFormulario}
          className="m-2"
        />
      </div>
      <div className="col-span-2">
        <label className="text-lg font-bold">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={manejarCambioFormulario}
          className="bg-base-100 text-base-content w-full p-2 rounded-md border border-gray-700"
        />
      </div>
      <div className="col-span-2">
        <label className="text-lg font-bold">Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={manejarCambioFormulario}
          className="bg-base-100 text-base-content w-full p-2 rounded-md border border-gray-700"
        />
      </div>
      <div className="col-span-2">
        <label className="text-lg font-bold">Teléfono:</label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={manejarCambioFormulario}
          className="bg-base-100 text-base-content w-full p-2 rounded-md border border-gray-700"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-warning transition-colors"
        >
          {proveedorSeleccionado ? "Actualizar Proveedor" : "Crear Proveedor"}
        </button>
      </div>
    </form>


    <div className="mt-4">
      <button
        onClick={() => setMostrarLista(!mostrarLista)}
        className={`w-full py-2 px-4 rounded-lg text-white ${
          mostrarLista ? "bg-error hover:bg-red-600" : "bg-info hover:bg-secondary"
        }`}
      >
        {mostrarLista ? "Ocultar Lista" : "Mostrar Lista"}
      </button>
    </div>


    {mostrarLista && (
      <ul className="space-y-4 mt-4">
        {proveedores.map((proveedor) => (
          <div
            key={proveedor._id}
            className="bg-neutral shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary">{proveedor.nombre}</h3>
            {proveedor.cif && <p>CIF: {proveedor.cif}</p>}
            {proveedor.email && <p>Email: {proveedor.email}</p>}
            {proveedor.direccion && <p>Dirección: {proveedor.direccion}</p>}
            {proveedor.telefono && <p>Teléfono: {proveedor.telefono}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
                onClick={() => manejarEditarProveedor(proveedor)}
              >
                Editar
              </button>
              <button
                className="bg-error text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                onClick={() => eliminarProveedor(proveedor._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </ul>
    )}
  </div>
);
};

export default Proveedores;
