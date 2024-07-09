import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ChatPage from './components/ChatPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;


// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';


// function App() {
//   const [file, setFile] = useState(null);
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [userMessage, setUserMessage] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setText(response.data.text);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

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
//     <div className="App">
//       <h1>Upload PDF and Chat</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
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

// export default App;
