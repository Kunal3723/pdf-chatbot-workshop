import React, { useState } from 'react';
import './MessageForm.css';
import { BsArrowRight } from 'react-icons/bs';

const MessageForm = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="message"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        autoComplete="off"
      />
      <button type="submit" aria-label="Send">
        <BsArrowRight size={20} />
        <span>Send</span>
      </button>
    </form>
  );
};

export default MessageForm;
