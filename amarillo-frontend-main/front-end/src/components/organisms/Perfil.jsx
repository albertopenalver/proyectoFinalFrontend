/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import "daisyui";

import Navbar from '../molecules/Navegador';
import AddUser from '../molecules/AddUser';
import ShowUser from '../molecules/ShowUser';
import UpdateUserPhoto from '../molecules/AgregarImagenUser';
import UpdateUserName from '../molecules/cambiarNombreUsuario';
import Footer from '../molecules/footer';

import { jwtDecode } from "jwt-decode";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        fetch(`https://amarillo-backend.onrender.com/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error fetching user details');
          }
          return response.json();
        })
        .then(data => {
          setUser(data);
          setIsAdmin(data.permisos === "admin");
          setIsCreator(data.permisos === "creador");
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);



  useEffect(() => {
    const token = localStorage.getItem('token')
    if (isAdmin || isCreator) {
      fetch(`https://amarillo-backend.onrender.com/user`, {
        method:'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', },}
      )
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error('Error fetching users:', error));
    }
  }, [isAdmin, isCreator,]);
  

  const handleDeleteUser = (userId) => {
    fetch(`https://amarillo-backend.onrender.com/user/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setUsers(users.filter((user) => user._id !== userId));
        
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleAssignAdmin = (userId) => {
    fetch(`https://amarillo-backend.onrender.com/user/${userId}/admin`, {
      method: 'put',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setUsers(users)
        
      })
      .catch((error) => console.error('Error deleting user:', error));
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto my-12 p-6 bg-base-100">
      {loading ? (
          <div className="border-neutral h-20 w-20 animate-spin rounded-full border-8 border-t-primary mx-auto my-4"></div>
        ) : (
        user && (
          <div className="profile text-center bg-neutral rounded-2xl shadow-xl p-8 space-y-6">
  
            <h1 className="text-3xl font-bold text-primary">Perfil de {user.nombre}</h1>
            <img
              src={user.foto}
              alt="Avatar"
              className="avatar w-36 h-36 rounded-full mx-auto mt-4 mb-4 shadow-lg"
            />
            <p className="text-white text-lg">Email: {user.email}</p>
            <p className="text-white text-lg">Permisos: {user.permisos}</p>
  
            <div className="mt-6 space-y-4">
              <UpdateUserPhoto setUser={setUser} />
             
              <UpdateUserName setUser={setUser} />
            </div>
  
            {/* Admin Section */}
            {(isCreator || isAdmin) && (
              <div className="admin-section mt-8 flex justify-center space-x-6">
                <button 
                  className="btn bg-primary text-white rounded-full py-2 px-6 hover:bg-accent transform transition-all duration-300 ease-in-out"
                  onClick={() => setShowAddUserModal(true)}
                >
                  Agregar Usuario
                </button>
                <button 
                  className="btn bg-primary text-white rounded-full py-2 px-6 hover:bg-accent transform transition-all duration-300 ease-in-out"
                  onClick={() => setShowUserListModal(true)}
                >
                  Lista de Usuarios
                </button>
              </div>
            )}
  
          </div>
        )
        )}
      </div>
  
      {/* Modals */}
      {showAddUserModal && (
        <AddUser
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          setUsers={setUsers}
          users={users}
        />
      )}
  
      {showUserListModal && (
        <ShowUser
          isOpen={showUserListModal}
          onClose={() => setShowUserListModal(false)}
          users={users}
          setUsers={setUsers}
          handleAssignAdmin={handleAssignAdmin}
          handleDeleteUser={handleDeleteUser}
        />
      )}
      <Footer />
    </>
  );
  
};

export default Perfil;
