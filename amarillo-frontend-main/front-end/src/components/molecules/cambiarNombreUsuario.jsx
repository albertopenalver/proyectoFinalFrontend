import { useState } from 'react';
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const UpdateUserName = ({setUser}) => {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    //const API_URL = import.meta.env.VITE_API_BASE_URL;
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          alert('No se encontró un token. Por favor, inicia sesión.');
          return;
        }
  
        const decoded = jwtDecode(token); 
        const userId = decoded?.userId; 
  
        const response = await fetch(`https://amarillo-backend.onrender.com/user/${userId}/nombre`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ nombre: newName }), 
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSuccess('Nombre actualizado correctamente');
          setError('');
          setNewName('');
          setUser((prevUser)=>({...prevUser,...data}))
        } else {
          setError(data.message || 'Error al actualizar el nombre');
          setSuccess('');
        }
      } catch (err) {
        console.error('Error al conectar con el servidor:', err);
        setError('Error al conectar con el servidor');
        setSuccess('');
      }
    };
  
    return (
      <div className="rounded-xl bg-base-100 p-4">
        <h2>Actualizar Nombre</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">
              Nuevo Nombre:
            </label>
            <input
              type="text"
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Introduce el nuevo nombre"
              className=" sm:w-80 w-full px-3 py-2 border border-gray-300 rounded-lg bg-neutral text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-neutral rounded-lg hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-accent"
          >
            Actualizar
          </button>
        </form>
        {success && <p className="mt-4 text-success">{success}</p>}
        {error && <p className="mt-4 text-error">{error}</p>}
      </div>
    );
    
  };
  export default UpdateUserName;