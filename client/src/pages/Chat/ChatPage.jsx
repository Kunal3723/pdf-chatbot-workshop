import React, { useState, useEffect } from 'react';
import { sendMessage } from '../../api/index';
import './ChatPage.css';
import useScrollToBottom from '../../hooks/useScrollToBottom';
import useProjectIDAuth from '../../hooks/useProjectIDAuth';
import MessageList from '../../components/MessageList/MessageList';
import MessageForm from '../../components/MessageForm/MessageForm';

function ChatPage() {
  const projectID = localStorage.getItem('projectID');
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('chatMessages' + projectID)) || []);

  // Custom hook for scrolling to bottom
  const messagesEndRef = useScrollToBottom([messages]);

  // Custom hook for checking projectID and redirecting if not present
  useProjectIDAuth(projectID);

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);

    try {
      const botResponse = await sendMessage(userMessage, projectID);
      setMessages([...newMessages, { sender: 'bot', text: botResponse.response }]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setMessages([
        ...newMessages,
        { sender: 'bot', text: 'Error getting response from server.' },
      ]);
    }
  };

  useEffect(() => {
    localStorage.setItem('chatMessages' + projectID, JSON.stringify(messages));
  }, [messages, projectID]);

  return (
    <div className="ChatPage">
      <div className="messages-container">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatPage;
