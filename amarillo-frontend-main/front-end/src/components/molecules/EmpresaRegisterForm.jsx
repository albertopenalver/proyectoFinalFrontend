import { useState } from "react";
import { useNavigate } from 'react-router-dom';


const EmpresaRegisterForm = () => {
    const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nombre: "",
    email: "",
    contraseña: "",
  });

  const [empresaData, setEmpresaData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //const API_URL = import.meta.env.BASE_URL;

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  const handleEmpresaChange = (e) => {
    setEmpresaData({ ...empresaData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
  
    const payload = {
      ...userData,
      empresa: empresaData, 
    };
  
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/empresas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data) {
          navigate("/login");
        } else {
          setErrors({ general: "Registro completado pero no se pudo procesar la respuesta correctamente." });
        }
      } else {
        const error = await response.json();
        setErrors({ general: error.message || "Error al registrar." });
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      setErrors({ general: "Error de conexión al servidor" });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Registro de Empresa</h2>
          <form onSubmit={handleSubmit}>
            {/* Empresa Fields */}
            <div className="form-control">
              <label htmlFor="nombreEmpresa" className="label">
                <span className="label-text">Nombre de la Empresa</span>
              </label>
              <input
                type="text"
                id="nombreEmpresa"
                name="nombre"
                value={empresaData.nombre}
                onChange={handleEmpresaChange}
                required
                className="input input-bordered"
              />
              {errors.nombre && <span className="text-error">{errors.nombre}</span>}
            </div>
            <div className="form-control">
              <label htmlFor="direccion" className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={empresaData.direccion}
                onChange={handleEmpresaChange}
                required
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label htmlFor="telefono" className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={empresaData.telefono}
                onChange={handleEmpresaChange}
                required
                className="input input-bordered"
              />
              {errors.telefono && <span className="text-error">{errors.telefono}</span>}
            </div>
            <div className="form-control">
              <label htmlFor="correo" className="label">
                <span className="label-text">Correo Electrónico</span>
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={empresaData.correo}
                onChange={handleEmpresaChange}
                required
                className="input input-bordered"
              />
            </div>

            {/* Creador Fields */}
            <div className="mt-4 mb-4 border-b-2 border-gray-300"></div>
            <h2 className="card-title">Registro de Creador</h2>
            <div className="form-control">
              <label htmlFor="nombreCreador" className="label">
                <span className="label-text">Nombre del Creador</span>
              </label>
              <input
                type="text"
                id="nombreCreador"
                name="nombre"
                value={userData.nombre}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label htmlFor="emailCreador" className="label">
                <span className="label-text">Email del Creador</span>
              </label>
              <input
                type="email"
                id="emailCreador"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label htmlFor="contraseñaCreador" className="label">
                <span className="label-text">Contraseña del Creador</span>
              </label>
              <input
                type="password"
                id="contraseñaCreador"
                name="contraseña"
                value={userData.contraseña}
                onChange={handleUserChange}
                required
                className="input input-bordered"
              />
            </div>
            {errors.general && <div className="text-error">{errors.general}</div>}

            {/* Actions */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Empresa y Creador'}
              </button>
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() => window.location.href = '/'}
              >
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

export default EmpresaRegisterForm;