/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import Navbar from '../molecules/Navegador';

import { jwtDecode } from "jwt-decode";

const MessagingApp = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [userLoged, setUserLoged] = useState(null);
  const [socket, setSocket] = useState(null); // Socket
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]); 
  const [messageInput, setMessageInput] = useState(""); 
  const [userShow, setUserShow] = useState(false);

  const messagesEndRef = useRef(null);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
  
        fetch(`https://amarillo-backend.onrender.com/user/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              setUserLoged(data);
  
              const newSocket = window.io(`https://amarillo-backend.onrender.com`);
              setSocket(newSocket);
  
              newSocket.on('connect', () => {
                newSocket.emit('user', { nombre: data.nombre });
              });
  
              return () => {
                newSocket.disconnect();
              };
            }
          })
          .catch((error) => console.error('Error al obtener detalles del usuario:', error));
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  
useEffect(() => {
  const token = localStorage.getItem('token');
  const fetchUsers = async () => {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/user`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error en la respuesta del servidor:", response.status);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      setIsLoading(false);
    }
  };

  fetchUsers();
}, []);


  useEffect(() => {
    if (socket) {
      socket.on('new_private_message', ({ sender, message }) => {
        if (selectedUser && sender === selectedUser.nombre) {
          setMessages((prev) => [...prev, { sender, message }]);
        }});
  
      return () => {
        socket.off('new_private_message');
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserSelection = async (user) => {
    setSelectedUser(user);
    if (socket) {
      socket.emit('select_user', {
        sender: userLoged.nombre,
        recipient: user.nombre,
      });
    }

    try {
      const response = await fetch(
        `https://amarillo-backend.onrender.com/mensaje?sender=${userLoged.nombre}&recipient=${user.nombre}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    }
  };

const handleSendMessage = async () => {
  if (messageInput.trim() && selectedUser) {
    try {
      const response = await fetch(`https://amarillo-backend.onrender.com/mensaje`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          sender: userLoged.nombre,
          recipient: selectedUser.nombre,
          message: messageInput,
        }),
        
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: userLoged.nombre, message: messageInput },
          
        ]);
        setMessageInput("");
        
      } else {
        console.error('Error al guardar el mensaje:', data.error);
      }
      socket.emit('send_private_message', {
        sender: userLoged.nombre,
        recipient: selectedUser.nombre,
        message: messageInput,
      });
      setMessageInput('');

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
};


return (
  <div>
    <Navbar />
    <div className="flex h-screen">
      
      <aside className={`overflow-y-auto w-1/4 bg-neutral border-r border-primary p-4 ${userShow ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-lg font-semibold mb-4 text-white">Usuarios</h2>
        {isLoading ? (
          <p className="text-gray-400">Cargando usuarios...</p>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user._id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-600 text-white ${
                  selectedUser?._id === user._id ? "bg-primary text-neutral font-bold" : ""
                }`}
                onClick={() => handleUserSelection(user)}
              >
                <p>{user.nombre}</p>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div className={`flex flex-col ${userShow ? "hidden md:flex" : "w-full"} bg-gray-900`}>
        <header className="bg-neutral text-white p-4">
          <h2 className="text-lg font-semibold">
            Chat con {selectedUser ? selectedUser.nombre : "ningún usuario seleccionado"}
          </h2>
        </header>
        <div ref={messagesEndRef} className="flex-1 bg-gray-800 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400">No hay mensajes aún.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded mb-2 text-white ${
                  msg.sender === userLoged.nombre ? "bg-blue-600 bg-opacity-60" : "bg-gray-600"
                }`}
              >
                <strong>{msg.sender}: </strong>
                {msg.message}
              </div>
            ))
          )}
        </div>
        <footer className="p-4 bg-gray-800 border-t border-gray-700 flex items-center">
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1 mr-2 bg-gray-700 text-white placeholder-gray-400"
            placeholder="Escribe un mensaje..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-600"
            disabled={!selectedUser}
          >
            Enviar
          </button>
        </footer>
      </div>
    </div>
    {/* Botón para mostrar los usuarios en pantallas pequeñas */}
    <div className="md:hidden fixed top-20 right-4 bg-blue-700 text-white p-2 rounded-full">
        <button onClick={() => setUserShow(!userShow)}>
          {userShow ? 'Ocultar Usuarios' : 'Mostrar Usuarios'}
        </button>
      </div>

      {/* Ventana flotante para mostrar usuarios */}
      {userShow && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-99 flex justify-center items-center">
    <div className="bg-black p-4 w-80 rounded">
      <h2 className="text-lg font-semibold mb-4">Usuarios</h2>
      <ul className="space-y-2 overflow-y-auto max-h-60">
        {users.map((user) => (
          <li
          key={user._id}
          className={`p-2 rounded cursor-pointer hover:bg-gray-600 text-white ${
            selectedUser?._id === user._id ? "bg-primary text-neutral font-bold" : ""
          }`}
          onClick={() => handleUserSelection(user)}
        >
          <p>{user.nombre}</p>
        </li>
        ))}
      </ul>
      <button onClick={() => setUserShow(false)} className="mt-4 bg-red-600 text-white p-2 rounded">
        Cerrar
      </button>
    </div>
  </div>
)}
  </div>
);
}

export default MessagingApp;