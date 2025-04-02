import { useState, useEffect } from 'react';
import { ChatProvider } from '../molecules/ChatContext';

import Proveedores from "../molecules/FormCrearProveedores";
import Categorias from '../molecules/FormCrearCategorias';
import Navbar from "../molecules/Navegador";
import Footer from '../molecules/footer';
import ChatWindow from '../molecules/ChatWindow';
import MessageInput from "../molecules/MessageInput";

const HomePage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      // Replace this with actual data fetching logic
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="bg-base-100 text-base-content h-screen flex flex-col"> {/* Use custom theme classes */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="border-neutral h-20 w-20 animate-spin rounded-full border-8 border-t-primary"></div>
        </div>
      ) : (
        <ChatProvider>
          <Navbar />

          {/* Main content sections */}
          <div className="flex flex-col lg:flex-row justify-center gap-4 bg-neutral text-gray-100 py-8 flex-grow">
            <div className="w-full lg:w-2/5 p-6">
              <Proveedores />
            </div>
            <div className="w-full lg:w-2/5 p-6">
              <Categorias />
            </div>
          </div>

          {/* Chat container */}
          <div className="container mx-auto flex-grow">
            <div className="fixed bottom-0 right-0 mb-4 mr-4">
              {/* Chat toggle button */}
              <button
                id="open-chat"
                onClick={() => setChatOpen(!chatOpen)}
                className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-warning transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Chat
              </button>

              {/* Chat window */}
              {chatOpen && (
                <div id="chat-container" className="fixed bottom-16 right-4 bg-neutral shadow-md rounded-lg w-80">
                  <div className="p-4 border-b bg-neutral text-white rounded-t-lg flex justify-between items-center">
                    <p className="text-lg font-semibold">Chat</p>
                    {/* Close button */}
                    <button
                      id="close-chat"
                      onClick={() => setChatOpen(false)}
                      className="text-gray-300 hover:text-gray-400 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat content */}
                  <ChatWindow />

                  {/* Message input */}
                  <MessageInput />
                </div>
              )}
            </div>
          </div>
          <Footer />
        </ChatProvider>
      )}
    </div>
  );
}

export default HomePage;
