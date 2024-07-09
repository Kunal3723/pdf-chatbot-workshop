// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './ChatPage.css'

// function ChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [userMessage, setUserMessage] = useState('');
//   const [pdfText, setPdfText] = useState('');

//   useEffect(() => {
//     const storedText = localStorage.getItem('pdfText');
//     if (storedText) {
//       setPdfText(storedText);
//     }
//   }, []);

//   const handleMessageSend = async () => {
//     if (!userMessage.trim()) return;

//     const newMessage = { user: 'User', text: userMessage };
//     setMessages([...messages, newMessage]);

//     try {
//       const response = await axios.post('/chat', { message: userMessage });
//       const botMessage = { user: 'Bot', text: response.data.response };
//       setMessages((prevMessages) => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }

//     setUserMessage('');
//   };

//   return (
//     <div className="ChatPage">
//       <h1>Chat with Bot</h1>
//       <div id="chatBox">
//         <div id="messages">
//           {messages.map((msg, index) => (
//             <div key={index} className={`message ${msg.user}`}>
//               <strong>{msg.user}:</strong> {msg.text}
//             </div>
//           ))}
//         </div>
//         <input
//           type="text"
//           value={userMessage}
//           onChange={(e) => setUserMessage(e.target.value)}
//         />
//         <button onClick={handleMessageSend}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

function ChatPage() {
  const location = useLocation();
  const { pdfText } = location.state || {};

  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = e.target.message.value;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    e.target.reset();

    try {
      const response = await axios.post('/chat', {
        message: userMessage,
        pdfText: pdfText,
      });
      const botResponse = response.data.reply;
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      setMessages([...newMessages, { sender: 'bot', text: 'Error getting response from server.' }]);
    }
  };

  return (
    <div className="ChatPage">
      <h1>Chat with PDF</h1>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
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
