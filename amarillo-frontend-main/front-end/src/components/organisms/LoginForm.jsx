import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'daisyui/dist/full.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', contraseña: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); 
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/user/login`, 
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          contraseña: formData.contraseña,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/homepage');
        } else {
          setErrors({ general: 'Ha ocurrido un error. Inténtalo más tarde.' });
        }
      } else if (response.status === 401) {
        setErrors({ general: 'Email o contraseña incorrectos' });
      } else {
        setErrors({ general: 'Ha ocurrido un error. Inténtalo más tarde.' });
      }
    } catch (error) {
      console.error("Caught error", error);
      setErrors({ general: 'Ha ocurrido un error. Inténtalo más tarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                value={formData.contraseña}
                onChange={handleChange}
                required
                className="input input-bordered"
              />
            </div>
            {errors.general && (
              <div className="text-error">{errors.general}</div>
            )}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
              <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/')}>
                Cancelar
              </button>
            </div>
          </form>
          <p>
            <button onClick={() => console.log('Recuperar contraseña')} className="link link-primary">
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p>
            ¿No tienes una cuenta?{' '}
            <button onClick={() => navigate('/register')} className="link link-primary">
              Registrarse
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
