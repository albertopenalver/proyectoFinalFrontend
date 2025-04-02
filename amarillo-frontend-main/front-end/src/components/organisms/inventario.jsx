/* eslint-disable react-hooks/exhaustive-deps */
import BotonAgregarProducto from '../molecules/BotonAgregarProducto.jsx';
//import AgregarProducto from '../molecules/AgregarProducto.jsx';
import { useEffect, useState } from 'react';
import FiltroProducto from '../molecules/buscadorInventario.jsx';
import OrdenarInventario from '../molecules/OrdenarInventario.jsx';
import Navbar from '../molecules/Navegador.jsx';
import AgregarImagenProducto from '../molecules/AgregarImagenProducto.jsx'
import Footer from '../molecules/footer.jsx'



const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditable, setProductoEditable] = useState(null);
  const [productosOriginales, setProductosOriginales] = useState([]); // Para conservar la lista original
  const [proveedor, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [criterio, setCriterio] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Cargar productos desde la API
  const mostrarProductos = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token no encontrado. Por favor, inicia sesión.');
        return; 
    }

    try {
        const response = await fetch(`https://amarillo-backend.onrender.com/product`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('No autorizado. El token puede ser inválido o haber expirado.');
                localStorage.removeItem('token'); 
                alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
            } else {
                console.error(`Error al obtener productos: ${response.statusText}`);
            }
            return; 
        }

        const data = await response.json();
        setProductos(data);
        setProductosOriginales(data);
    } catch (error) {
        console.error('Error de red o servidor al obtener productos:', error);
    }
};
  useEffect(() => {
    mostrarProductos();
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
  
  const ordenarProductos = (criterio) => {
    let productosOrdenados = [...productosOriginales];

    switch (criterio){
      case "fecha":
        productosOrdenados.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "nombre":
        productosOrdenados.sort((a,b) => a.nombre.localeCompare(b.nombre));
        break;
      case "proveedor":
        productosOrdenados.sort((a,b) => a.proveedor?.nombre.localeCompare(b.proveedor?.nombre));
        break;
      case 'categoria':
        productosOrdenados.sort((a, b) => a.categoria?.nombre.localeCompare(b.categoria?.nombre));
        break;   
      default:
        productosOrdenados = productosOriginales;       
    }
    setCriterio(criterio)
    setProductos(productosOrdenados)
  }


  const handleEditClick = (producto) => {
    setProductoEditable(producto);
  };

  const closeEditForm = () => {
    setProductoEditable(null);
  };


  const eliminarProducto = async (id) => {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/product/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProductos((prevProductos) => prevProductos.filter((producto) => producto._id !== id));
        setProductosOriginales((prevProductos) => prevProductos.filter((producto) => producto._id !== id));
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const editarProducto = async (id, productoEditable) => {
    try {
      const productoActualizado = {
        ...productoEditable,
        categoria: productoEditable.categoria,
        proveedor: productoEditable.proveedor,
      };
  
      const response = await fetch(`https://amarillo-backend.onrender.com/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoActualizado),
      });
  
      if (response.ok) {        

        mostrarProductos();
        setProductoEditable(null);
      } else {
        console.error('Error al editar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud de edición:', error);
    }
  };

  const agregarProducto = (nuevoProducto) => {
    const nuevosProductos = [...productosOriginales, nuevoProducto];
    setProductosOriginales(nuevosProductos);
    setProductos(nuevosProductos);
    setCriterio("");
  };

 
  const buscarProductos = (valorFiltro, filtroSeleccionado) => {
    if (!valorFiltro) {
      setProductos(productosOriginales); 
    } else {
      const resultadosFiltrados = productosOriginales.filter(producto => {
        switch (filtroSeleccionado) {
          case 'nombre':
            return producto.nombre.toLowerCase().includes(valorFiltro.toLowerCase());
          case 'id':
            return producto._id === valorFiltro;
          case 'categoria':
            return producto.categoria && producto.categoria.nombre.toLowerCase().includes(valorFiltro.toLowerCase());
          case 'proveedor':
          return producto.proveedor && producto.proveedor.nombre.toLowerCase().includes(valorFiltro.toLowerCase());
          default:
            return true;
        }
      });
      setProductos(resultadosFiltrados);
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const abrirFormulario = () => {
    setShowForm(true);
  };

  const handleImgClick = (producto) => {
    abrirFormulario(producto);
    seleccionarProducto(producto);
  };

  const handleFormSubmitimg = async (e,) => {
    e.preventDefault();
    console.log("producto handle",productoSeleccionado)
    if (!productoSeleccionado || !productoSeleccionado._id) {
      console.error("Producto no válido o sin ID");
      return;
    }
  
    const fileInput = e.target.elements.photo; 
  
    if (fileInput.files[0]) {
      try {
        const formData = new FormData();
        formData.append("photo", fileInput.files[0]);

        const productId = productoSeleccionado._id;

        const response = await fetch(`https://amarillo-backend.onrender.com/product/${productId}/photo`, {
          method: "PUT",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Error al actualizar la imagen");
        }
  
        const data = await response.json();
  
        setProductos((prevProductos) =>
          prevProductos.map((p) =>
            p.id === productId ? { ...p, foto: data.foto } : p
          )
        );
        setProductosOriginales((prevProductos) =>
          prevProductos.map((p) =>
            p.id === productId ? { ...p, foto: data.foto } : p
          )
        );
        mostrarProductos();
        setShowForm(false)
      } catch (error) {
        console.error("Error al actualizar la imagen:", error);
      }
    }
  };
  


  return (
    <div className="bg-base-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Inventario de Productos
        </h1>
  
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <BotonAgregarProducto
            onProductoAgregado={agregarProducto}
            setProveedores={setProveedores}
            setCategorias={setCategorias}
          />
          <OrdenarInventario onOrdenar={ordenarProductos} valorSeleccionado={criterio} />
          <FiltroProducto onBuscar={buscarProductos} />
        </div>
  
        {productoEditable && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-neutral p-6 shadow-lg rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold text-primary mb-4">Editar Producto</h2>
              <input
                type="text"
                value={productoEditable.nombre || ""}
                onChange={(e) =>
                  setProductoEditable({ ...productoEditable, nombre: e.target.value })
                }
                placeholder="Nombre"
                className="border p-2 bg-base-100 rounded mb-3 w-full"
              />
              <input
                type="number"
                value={productoEditable.cantidad || ""}
                onChange={(e) =>
                  setProductoEditable({ ...productoEditable, cantidad: e.target.value })
                }
                placeholder="Cantidad"
                className="border p-2 bg-base-100 rounded mb-3 w-full"
              />
              <select
                value={productoEditable.categoria || ""}
                onChange={(e) =>
                  setProductoEditable({ ...productoEditable, categoria: e.target.value })
                }
                className="border p-2 bg-base-100 rounded mb-3 w-full"
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <select
                value={productoEditable.proveedor || ""}
                onChange={(e) =>
                  setProductoEditable({ ...productoEditable, proveedor: e.target.value })
                }
                className="border p-2 bg-base-100 rounded mb-4 w-full"
              >
                <option value="">Selecciona un proveedor</option>
                {proveedor.map((proveedor) => (
                  <option key={proveedor._id} value={proveedor._id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => editarProducto(productoEditable._id, productoEditable)}
                  className="bg-success text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Guardar Cambios
                </button>
                <button
                  onClick={closeEditForm}
                  className="bg-error text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Product List */}
        {productos.length > 0 ? (
          <div className="space-y-4">
            {productos.map((producto) => {
              const createdDate = new Date(producto.createdAt).toLocaleString();
  
              return (
                <div
                  key={producto._id}
                  className="flex flex-col md:flex-row items-center bg-neutral shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow"
                >
                  <AgregarImagenProducto
                    producto={producto}
                    productoId={producto._id}
                    setProductos={setProductos}
                    productos={productos}
                    setProductosOriginales={setProductosOriginales}
                    onClick={() => handleImgClick(producto)}
                  />
                  <div className="flex-1 text-white">
                    <h2 className="text-xl font-semibold mb-1">{producto.nombre}</h2>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>ID: {producto._id}</p>
                    {producto.categoria && <p>Categoría: {producto.categoria.nombre}</p>}
                    {producto.proveedor && <p>Proveedor: {producto.proveedor.nombre}</p>}
                    <p>Creado el: {createdDate}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
                    <button
                      className="bg-secondary text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                      onClick={() => handleEditClick(producto)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-error text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      onClick={() => eliminarProducto(producto._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-info">No hay productos disponibles.</p>
        )}
      </div>
  
      {/* Image Change Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-neutral p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-primary mb-4">Cambiar Imagen</h2>
            <form onSubmit={(e) => handleFormSubmitimg(e, showForm)} encType="multipart/form-data">
              <label className="block mb-3 text-white">
                Subir nueva imagen:
                <input type="file" name="photo" accept="image/*" required className="block mt-2" />
              </label>
              <div className="flex justify-end space-x-3">
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-yellow-700">
                  Actualizar Foto
                </button>
                <button
                  type="button"
                  className="bg-error text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
  
};

export default Productos;
