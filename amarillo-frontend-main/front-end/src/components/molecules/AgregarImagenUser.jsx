import { useState } from 'react';
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types
const UpdateUserPhoto = ({setUser}) => {
  const [photo, setPhoto] = useState(null);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);  // Guardar el archivo seleccionado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert('Por favor, selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);  

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token); 
      const userId = decoded?.userId;
      const response = await fetch(`https://amarillo-backend.onrender.com/user/${userId}/photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`  // Enviar el token para autenticación
        },
        body: formData,  // Enviar los datos del formulario con la foto
      });

      if (response.ok) {
        const updatedUser = await response.json();  
        setUser((prevUser)=>({...prevUser,...updatedUser}))
        alert('Foto actualizada correctamente');
      } else {
        alert('Error al actualizar la foto');
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
    }
  };

  return (
    <form className=" rounded-xl bg-base-100 space-y-2 space-x-12 p-8" onSubmit={handleSubmit}>
      <input className=" w-80 px-1 py-2 bg-base-100 text-white rounded-lg"
 type="file" onChange={handleFileChange} accept="image/*" /> {/* Aceptar solo imágenes */}
      <button className=" px-4 py-2 text-black rounded-lg bg-primary hover:bg-secondary " type="submit ">Actualizar Foto</button>
    </form>
  );
};

export default UpdateUserPhoto;