import { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from './ChatContext';
import Message from './Message';

const ChatWindow = () => {
  const { messages } = useContext(ChatContext);
  const [scrollPosition] = useState(0);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    chatWindow.scrollTop = (chatWindow.scrollHeight - chatWindow.clientHeight) * (scrollPosition / 100);
  }, [scrollPosition]);


  return (
    <div className="chat-window p-4 bg-base-900 rounded-lg shadow-lg flex">
      <div id="chat-window" ref={chatWindowRef} className="overflow-y-auto h-40 p-5 flex-grow">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
