import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import './ChatPage.css';

function ChatPage() {
  const location = useLocation();
  const { pdfText } = location.state || {};
  const projectID = localStorage.getItem('projectID');
  const [messages, setMessages] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = e.target.message.value;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    e.target.reset();

    try {
      const response = await axios.post('https://pdf-chatbot-workshop.onrender.com/query', {
        query: userMessage,
        projectID: projectID,
      });
      const botResponse = response.data;
      setMessages([...newMessages, { sender: 'bot', text: botResponse.response }]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error getting response from server.' }]);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="ChatPage">
      <h1>Chat with PDF</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              {message.text}
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleSendMessage}>
          <input type="text" name="message" placeholder="Type your message..." autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
