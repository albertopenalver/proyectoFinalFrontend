/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userName = decoded.nombre;
        const userId = decoded.userId;

        setUserName(userName);

        fetch(`https://amarillo-backend.onrender.com/user/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data && data.foto) {
              setUserName(data.nombre);
              setUserPhoto(data.foto);
            }
          })
          .catch((error) => {
            console.error('Error fetching user details:', error);
          });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div>
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-neutral text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold">VENTATRACK</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-base-100 text-white p-4 z-40">
          <Link to="/products" className="block py-2" onClick={() => setMenuOpen(false)}>
            Productos
          </Link>
          <Link to="/category" className="block py-2" onClick={() => setMenuOpen(false)}>
            Categorías
          </Link>
          <Link to="/proveedores" className="block py-2" onClick={() => setMenuOpen(false)}>
            Proveedores
          </Link>
          <Link to="/perfil" className="block py-2" onClick={() => setMenuOpen(false)}>
            Perfil
          </Link>
          <Link to="/mensajes" className={`hover:text-green-400 ${isActive('/mensajes') ? 'font-bold text-green-400' : ''}`}>
            Mensajes
          </Link>
          <Link to="/recepcion" className="block py-2" onClick={() => setMenuOpen(false)}>
            Movimientos
          </Link>
          <Link to="/" className="block py-2" onClick={() => setMenuOpen(false)}>
            LogOut
          </Link>
        </div>
      )}

      {/* Desktop Navbar */}
      <div className="navbar bg-base-100 text-white p-5 flex justify-between items-center md:flex">
        <div className="navbar-logo text-2xl font-bold">VENTATRACK</div>
        <div className="nav-links flex gap-4">
          <Link to="/homepage" className={`hover:text-green-400 ${isActive('/homepage') ? 'font-bold text-green-400' : ''}`}>
            Homepage
          </Link>
          <Link to="/products" className={`hover:text-green-400 ${isActive('/products') ? 'font-bold text-green-400' : ''}`}>
            Productos
          </Link>
          <Link to="/perfil" className={`hover:text-green-400 ${isActive('/perfil') ? 'font-bold text-green-400' : ''}`}>
            Perfil
          </Link>
          <Link to="/recepcion" className={`hover:text-green-400 ${isActive('/recepcion') ? 'font-bold text-green-400' : ''}`}>
            Movimientos
          </Link>
          <Link to="/mensajes" className={`hover:text-green-400 ${isActive('/mensajes') ? 'font-bold text-green-400' : ''}`}>
            Mensajes
          </Link>
          <Link to="/" className="hover:text-green-400">
            LogOut
          </Link>
        </div>
        <div className="pl-10 flex items-center">
          {userPhoto && <img src={userPhoto} alt={userName} className="w-12 h-12 rounded-full" />}
          {userName && <div className="user-name text-sm font-medium pl-4">{userName}</div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
