/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";  //para decodificar el token
/* eslint-disable react/prop-types */

const BotonAgregarProducto = ({ onProductoAgregado }) => {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    cantidad: '',
    proveedor: null,
    categoria: null,
    subcategoria: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]); 
  
  const [userEmpresa, setUserEmpresa]=useState("")

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Efecto para obtener proveedores desde la base de datos
  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchProveedores = async () => {
      try {
        const response = await fetch(`https://amarillo-backend.onrender.com/proveedor`,{
          method:'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },}); 
        if (response.ok) {
          const data = await response.json();
          setProveedores(data); 
          
        } else {
          console.error('Error al obtener proveedores');
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      }
    };

    fetchProveedores();
  }, []); 

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

  // Efecto para obtener categorías desde la base de datos
  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`https://amarillo-backend.onrender.com/category`,{
          method:'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },}
        );
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  

    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productoConEmpresa = {
      ...nuevoProducto,
      empresa: userEmpresa, // Añade la empresa del token al producto
    };
    
    const response = await fetch(`https://amarillo-backend.onrender.com/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productoConEmpresa ),
      

    });

    if (response.ok) {
      const productoAgregado = await response.json();
      // Llama a la función onProductoAgregado para actualizar el estado en el componente padre
      onProductoAgregado(productoAgregado);
      // Limpia el formulario
      setNuevoProducto({ nombre: '', cantidad: '', proveedor: null, categoria: null, subcategoria:null,empresa:userEmpresa });
      setShowForm((prev) => !prev)
    } else {
      console.error('Error al agregar el producto');
    }
  };


  return (
    <div>
      <button
        onClick={() => setShowForm((prev) => !prev)} // Alterna la visualización del formulario
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
      >
        {showForm ? "Cerrar formulario" : "Añadir nuevo producto"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-2">
          <input
            type="text"
            name="nombre"
            value={nuevoProducto.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="border bg-base-300 p-2 rounded mb-2 w-full"
            required
          />
          <input
            type="number"
            name="cantidad"
            value={nuevoProducto.cantidad}
            onChange={handleChange}
            placeholder="Cantidad"
            className="border bg-base-300 p-2 rounded mb-2 w-full"
            required
          />
          <select
            name="proveedor"
            value={nuevoProducto.proveedor !== null ? nuevoProducto.proveedor : ""}
            onChange={handleChange}
            className="border bg-base-300 p-2 rounded mb-2 w-full"
          >
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.nombre} value={proveedor._id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>

          

          <select
            name="categoria"
            value={nuevoProducto.categoria !== null ? nuevoProducto.categoria : ""}
            onChange={(e) => {
              handleChange(e);
              setNuevoProducto((prev) => ({ ...prev, subcategoria: '' }));
            }}
            className="border bg-base-300 p-2 rounded mb-2 w-full">
            <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
            <option key={categoria._id} value={categoria._id}> 
              {categoria.nombre}
            </option>
           ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Agregar
          </button>
        </form>
      )}
    </div>
  );
};

export default BotonAgregarProducto;

