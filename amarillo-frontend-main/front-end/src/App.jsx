import { Link } from 'react-router-dom';
import 'daisyui/dist/full.css';
import '/src/index.css';
import { useEffect, useState } from 'react';
import imagen1 from './assets/rb_6375.png';

function App() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Esperamos a que termine la animación del texto para mostrar el contenido.
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500); // Tiempo de duración de la animación (en milisegundos)

    return () => clearTimeout(timer); // Limpiamos el temporizador al desmontar el componente
  }, []);

  return (
    <div className="card place-content-start items-center pt-7 bg-base-900 text-white ">
      <main className="main-content flex flex-col py-4 mt-6 text-center ventario-fade-animation">
        <div className="welcome-text ">
          <h1 className="text-6xl mt-6 font-bold text-white ">
            VENTATRACK
          </h1>
          {showContent && (
            <>
              <p className="text-xl ">Sigues desde aquí los movimientos de tu empresa.</p>
              <p className="text-l  ">Por favor, inicia sesión o regístrate para continuar.</p>
              <div className="btn-group flex flex-col mt-6 ">
                <Link to="/login" className="btn btn-secondary mx-8 mb-4 my-1 ventario-fade-animation ">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary mx-8 mb-4 my-1 ventario-fade-animation ">
                  Registrarse
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="footer footer-center text-sm p-4">
        <aside>
          <p>© 2024 PROYECTO AMARILLO - FSD0642 - NDS</p>
        </aside>
      </footer>
      <img 
          src={imagen1} 
          alt="imagen1" 
          className="bottom-0 w-max h-max ventario-fade-animation" 
        />
    </div>
  );
}

export default App;