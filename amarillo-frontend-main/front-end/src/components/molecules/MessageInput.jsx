import { useState, useContext } from 'react';
import { ChatContext } from './ChatContext';

const MessageInput = () => {
  const [input, setInput] = useState('');
  const { addMessage } = useContext(ChatContext);

  //const API_URL = import.meta.env.VITE_API_BASE_URL;

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const token = localStorage.getItem('token'); 
      if (token) {
        const decoded = parseJwt(token); 
        if (decoded) {
          const nombre = decoded.nombre
          const userId = decoded.userId;
          const newMessage = { sender: nombre, content: input, userId };
          try {
            const response = await fetch(`https://amarillo-backend.onrender.com/msg`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newMessage),
            });
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            addMessage(data);
            setInput('');
          } catch (error) {
            console.error('Error sending message:', error);
          }
        } else {
          console.error('Failed to decode token');
        }
      } else {
        console.error('No token found');
      }
    }
  };

  return (
    <div className="message-input flex items-center p-4 bg-base-200 rounded-lg shadow-lg">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="input input-bordered w-full mr-2"
      />
      <button onClick={handleSend} className="btn btn-primary">Send</button>
    </div>
  );
};

export default MessageInput;
