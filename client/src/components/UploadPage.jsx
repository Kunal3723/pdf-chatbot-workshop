import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import './UploadPage.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://pdf-chatbot-workshop.onrender.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'userid': user.uid },
      });
      localStorage.setItem('projectID', response.data.projectID);
      navigate('/chat');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="UploadPage">
      <h1>Upload PDF</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the file here ...</p> : <p>Drag your file here, or click to select a file</p>}
      </div>
      {file && <p>Selected file: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default UploadPage;
