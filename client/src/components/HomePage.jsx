import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to ChatPDF Clone</h1>
      <p>Upload your PDF files and chat with your documents using AI!</p>
      <div className="features">
        <div className="feature">
          <h2>Upload PDFs</h2>
          <p>Drag and drop your PDF files to upload and start chatting.</p>
        </div>
        <div className="feature">
          <h2>Interactive Chat</h2>
          <p>Get instant responses to your queries from your PDF content.</p>
        </div>
        <div className="feature">
          <h2>Secure Login</h2>
          <p>Sign in securely using your Google account to access your documents.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
