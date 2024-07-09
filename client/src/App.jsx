import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import UploadPage from './pages/Upload/UploadPage';
import ChatPage from './pages/Chat/ChatPage';
import Navbar from './components/Navbar/Navbar';
import SignInPage from './pages/SignIn/SignInPage';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;