import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Productos from './components/organisms/inventario.jsx';

import Recepcion from './components/organisms/Recepcion.jsx';
import SolicitudCompra from './components/organisms/SolicitudCompra.jsx';
import Salida from "./components/organisms/Salida.jsx";
import MovimientosEntrada from "./components/molecules/MovimientosdeEntrada.jsx";

import RegisterForm from './components/organisms/RegisterForm.jsx';
import EmpresaRegisterForm from './components/molecules/EmpresaRegisterForm'; 
import SelectEmpresaForm from './components/molecules/SelectEmpresaForm';
import LoginForm from './components/organisms/LoginForm.jsx';
import HomePage from './components/organisms/HomepageMain.jsx';
import Cloudpics from './components/organisms/cloudpics.jsx';
import Perfil from './components/organisms/Perfil.jsx';
import ErrorPage from './components/molecules/ErrorPage.jsx'; // Import ErrorPage

import App from './App.jsx';
import ProtectedRoute from './components/molecules/ProtectedRoute.jsx';
import Mensajes from './components/organisms/Mensajes.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/empresa" element={<EmpresaRegisterForm />} /> 
        <Route path="/select-empresa" element={<SelectEmpresaForm />} />
        <Route path="/errorpage" element={<ErrorPage />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="/movimientosentrada" element={<MovimientosEntrada/>}/>
        <Route path="/salida" element={<Salida/>}/>
        <Route path="/solicitud" element={<SolicitudCompra/>}/>


        {/* Securing routes with ProtectedRoute */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/recepcion"
          element={
            <ProtectedRoute>
              <Recepcion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cloudpics"
          element={
            <ProtectedRoute>
              <Cloudpics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);

