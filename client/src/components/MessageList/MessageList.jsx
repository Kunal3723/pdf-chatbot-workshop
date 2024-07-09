import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, messagesEndRef }) => {
  return (
    <div className="messages">
      <div className="msg-cnt">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
