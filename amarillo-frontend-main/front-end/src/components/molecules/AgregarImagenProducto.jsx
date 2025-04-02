import { useState } from "react";
/* eslint-disable react/prop-types */

const AgregarImagenProducto = ({ producto,productoId,setProductos,setProductosOriginales  }) => {
  const [showForm, setShowForm] = useState(false);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

    const handleFormSubmitimg = (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      const fileInput = e.target.elements.photo;
      if (fileInput.files[0]) {
        formData.append('photo', fileInput.files[0]);
      }
     
      fetch(`https://amarillo-backend.onrender.com/product/${productoId}/photo`, {
        method: 'PUT',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Actualiza el estado con el nuevo valor para el producto
          setProductos((prevState) => {
            const updated = prevState.map((prod) =>
              prod._id === productoId ? { ...prod, foto: data.foto } : prod
            );
            return updated;
          });
          setProductosOriginales((prevState) => {
            const updated = prevState.map((prod) =>
              prod._id === productoId ? { ...prod, foto: data.foto } : prod
            );
            return updated;
          });
        })
        .catch((error) => {
          console.error('Error al actualizar la foto:', error);
        });
        
        setShowForm(false)
    };

    return (
      <>
        {/* Imagen del producto */}
        <img
          src={producto.foto}
          alt={producto.nombre}
          className="w-24 h-24 object-cover rounded-md mr-4 cursor-pointer"
          onClick={() => setShowForm(true)}
        />
  
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
              <h2 className="text-lg font-semibold mb-4">Cambiar Imagen</h2>
              <form
                onSubmit={handleFormSubmitimg}
                encType="multipart/form-data"
                method="POST"
              >
                <label className="block mb-4">
                  <span className="text-sm font-medium">Subir nueva imagen:</span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    className="mt-2 block w-full text-sm text-gray-600
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </label>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300" > 
                      Actualizar 
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
}
export default AgregarImagenProducto;
