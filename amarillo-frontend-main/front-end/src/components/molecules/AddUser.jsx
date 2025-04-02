import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react/prop-types, no-unused-vars
const AddUser = ({ isOpen, onClose, setUsers, users }) => {

  const [newUser, setNewUser] = useState({ nombre: '', email: '', contraseña: '', permisos: 'user', empresa: "" });
  const [userEmpresa, setUserEmpresa] = useState(null);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    
    const token = localStorage.getItem('token');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setNewUser({ ...newUser, permisos: e.target.checked ? 'admin' : 'user' });
  };

  const handleSubmit = async () => {
    if (!newUser.nombre || !newUser.email || !newUser.contraseña || !userEmpresa) {
      alert('Por favor complete todos los campos');
      return;
    }

    const addUser = { ...newUser, empresa: userEmpresa };

    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(addUser),
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data.user]);

      onClose();
      alert('Usuario creado correctamente');
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Hubo un error al crear el usuario');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="modal-header flex justify-between items-center">
            <h3 className="text-lg font-bold">Agregar Usuario</h3>
            <button className="text-xl" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="input input-bordered w-full my-2"
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full my-2"
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="contraseña"
              placeholder="Contraseña"
              className="input input-bordered w-full my-2"
              onChange={handleInputChange}
            />
            <label className="flex items-center space-x-3 my-2">
              <input
                type="checkbox"
                className="checkbox"
                onChange={handleCheckboxChange}
              />
              <span>Admin</span>
            </label>
          </div>
          <div className="modal-footer flex justify-end">
            <button className="btn btn-primary mr-2" onClick={handleSubmit}>Guardar</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
