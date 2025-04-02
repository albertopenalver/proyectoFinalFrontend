/* eslint-disable react/prop-types */
//is going to be imported so will automaticaly understand whats message
const Message = ({ message }) => {
  return (
    <div className="message">
      <strong>{message.sender}:</strong> {message.content}
    </div>
  );
};

export default Message;
