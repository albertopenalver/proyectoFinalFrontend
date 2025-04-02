import { useState } from 'react';

const CloudPix = () => {
  const [content, setContent] = useState(null);
  const [message, setMessage] = useState('');

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setContent(file); 
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!content) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.set('file', content);

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Archivo subido exitosamente!');
      } else {
        setMessage('Error al subir el archivo: ' + result.mensaje);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setMessage('Error al subir el archivo');
    }
  };

  return (
    <div className="flex items-center bg-grey space-x-10 mx-4 mt-7 mb-5">
      <input
        type="file"
        onChange={handleFileChange}
        className="input"
        placeholder="Put your picture here..."
      />
      <button onClick={handleUpload} className="btn btn-secondary">
        Upload
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CloudPix;
