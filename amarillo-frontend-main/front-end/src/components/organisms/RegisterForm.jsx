import { useNavigate } from 'react-router-dom';
import 'daisyui/dist/full.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Registro</h2>
          <div className="form-control mt-6">
            <button
              className="btn btn-primary mb-4"
              onClick={() => navigate('/empresa')}
            >
              Crear Empresa y Registrarse
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/select-empresa')}
            >
              Seleccionar Empresa Existente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
