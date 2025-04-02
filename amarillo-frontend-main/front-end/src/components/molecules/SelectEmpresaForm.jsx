/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'daisyui/dist/full.css';

const SelectEmpresaForm = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    contraseña: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchEmpresas = async () => {
      const response = await fetch(`https://amarillo-backend.onrender.com/empresas/`);
      const data = await response.json();
      setEmpresas(data);
      setFilteredEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    setFilteredEmpresas(
      empresas.filter((empresa) =>
        empresa.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, empresas]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEmpresaChange = (e) => {
    setSelectedEmpresa(e.target.value);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };
    switch (fieldName) {
      case 'nombre':
        newErrors.nombre = value.length < 3 ? 'Debe tener al menos 3 caracteres' : '';
        break;
      case 'email':
        newErrors.email = !/\S+@\S+\.\S+/.test(value) ? 'Email inválido' : '';
        break;
      case 'contraseña':
        newErrors.contraseña = value.length < 6 ? 'Debe tener al menos 6 caracteres' : '';
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    Object.keys(userData).forEach((key) => validateField(key, userData[key]));
    if (Object.values(newErrors).some((error) => error !== '')) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      
      const response = await fetch(`https://amarillo-backend.onrender.com/user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          empresa: selectedEmpresa, 
          permisos: 'user'
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem('token', data.token);
        const userResponse = await fetch(`https://amarillo-backend.onrender.com/user/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (userResponse.ok) {
          navigate('/homepage');
        } else {
          console.error('Error al obtener datos del usuario.');
        }
      } else if (data && data.message) {
        setErrors({ general: data.message });
      } else {
        setErrors({ general: 'Error al registrarse. Inténtalo de nuevo.' });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors({ general: 'Error de conexión al servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Seleccionar Empresa Existente</h2>
          <div className="form-control">
            <input
              type="text"
              placeholder="Buscar Empresa"
              value={searchTerm}
              onChange={handleSearchChange}
              className="input input-bordered"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="empresa" className="label">
                <span className="label-text">Empresas</span>
              </label>
              <select
                id="empresa"
                name="empresa"
                value={selectedEmpresa}
                onChange={handleEmpresaChange}
                required
                className="select select-bordered"
              >
                <option value="" disabled>Seleccione una empresa</option>
                {filteredEmpresas.map((empresa) => (
                  <option key={empresa._id} value={empresa._id}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="nombre" className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={userData.nombre}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
              {errors.nombre && <span className="text-error">{errors.nombre}</span>}
            </div>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
              {errors.email && <span className="text-error">{errors.email}</span>}
            </div>
            <div className="form-control">
              <label htmlFor="contraseña" className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={userData.contraseña}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
              {errors.contraseña && <span className="text-error">{errors.contraseña}</span>}
            </div>
            {errors.general && <div className="text-error">{errors.general}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
              <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                Cancelar
              </button>
            </div>
          </form>
          <p className="text-center mt-4">
            ¿Volver al inicio?{' '}
            <button onClick={() => navigate('/')} className="link link-primary">
              Inicio
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SelectEmpresaForm;
