import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <h1 className="text-3xl font-bold text-red-500 mt-4">Access Denied</h1>
      <p className="text-lg mt-2 text-center text-gray-700">
        Please log in to access this page.
      </p>
      <h2 className="text-lg mt-2 text-center text-gray-700">Debes tener una cuenta para entrar aqui.</h2>
      <button
        className="btn btn-primary mt-6"
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    </div>
  );
};

export default ErrorPage;
