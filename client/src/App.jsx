import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ChatPage from './components/ChatPage';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
