/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";  //para decodificar el token

const CategoriaManager = () => {
  // Estados
  const [categorias, setCategorias] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);

  const [userEmpresa, setUserEmpresa]=useState("")

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


  const crearCategoria = async () => {
    if (!nombreCategoria.trim()) return alert('Poner nombre categoria');

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //cuando hacemos el post le pasamos por prop el valor de la empresa que hemos obtenido del token
        body: JSON.stringify({ nombre: nombreCategoria, empresa:userEmpresa }),
      });

      const nuevaCategoria = await response.json();
      setCategorias([...categorias, nuevaCategoria.categoria]);
      setNombreCategoria(''); 
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };


  const editarCategoria = async (id) => {
    if (!nombreEditado.trim()) return alert('El nuevo nombre de la categoría es obligatorio');

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombreEditado }),
      });

      const categoriaActualizada = await response.json();
      setCategorias(
        categorias.map((categoria) => (categoria._id === id ? categoriaActualizada : categoria))
      );
      setEditandoId(null); // Salir del modo edición
      setNombreEditado('');
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    }
  };


  const eliminarCategoria = async (id) => {
    try {
      await fetch(`https://amarillo-backend.onrender.com/category/${id}`, {
        method: 'DELETE',
      });

      setCategorias(categorias.filter((categoria) => categoria._id !== id)); // Actualizar lista local
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen rounded-xl p-6"> 
 
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">Categorías</h1>
  
      <div className="bg-neutral p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Crear Nueva Categoría</h2>
        <input
          className="bg-base-100 text-base-content w-full p-2 rounded-md mb-4 border border-gray-700"
          type="text"
          placeholder="Nombre de la categoría"
          value={nombreCategoria}
          onChange={(e) => setNombreCategoria(e.target.value)}
        />
        <button
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-warning transition-colors"
          onClick={crearCategoria}
        >
          Crear
        </button>
      </div>
  
      <div className="my-4">
        {!mostrarLista ? (
          <button
            className="bg-info text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMostrarLista(true)}
          >
            Mostrar Lista
          </button>
        ) : (
          <button
            className="bg-error text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => setMostrarLista(false)}
          >
            Ocultar Lista
          </button>
        )}
      </div>
  
      {mostrarLista && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Listado de Categorías</h2>
          <ul className="space-y-4">
            {categorias.map((categoria) => (
              <div
                className="flex items-center bg-neutral shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
                key={categoria._id}
              >
                {editandoId === categoria._id ? (

                  <div>
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      className="bg-base-100 text-base-content p-2 rounded-md border border-gray-700"
                    />
                    <button
                      className="bg-success text-white py-2 px-4 rounded-lg ml-2 hover:bg-green-600 transition-colors"
                      onClick={() => editarCategoria(categoria._id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-neutral text-white py-2 px-4 rounded-lg ml-2 hover:bg-gray-600 transition-colors"
                      onClick={() => setEditandoId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (

                  <div className="flex justify-between w-full">
                    <span>{categoria.nombre}</span>
                    <div>
                      <button
                        className="bg-accent text-white py-2 px-4 rounded-lg hover:bg-secondary transition-colors mr-2"
                        onClick={() => {
                          setEditandoId(categoria._id);
                          setNombreEditado(categoria.nombre);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-error text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        onClick={() => eliminarCategoria(categoria._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
  
};

export default CategoriaManager;
