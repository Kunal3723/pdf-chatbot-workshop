import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../../api/index';
import './UploadPage.css';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import useAuth from '../../hooks/useAuth';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  useAuth();

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === 'application/pdf') {
      setFile(pdfFile);
    } else {
      alert('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const projectID = await uploadFile(file);
      localStorage.setItem('projectID', projectID);
      navigate('/chat');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="UploadPage">
      <h1>Upload PDF</h1>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <div className="dropzone-content">
            <AiOutlineCloudUpload size="8rem" />
            <p>Drag & drop any file here</p>
            <p>or <span className="browse-file">browse file</span> from device</p>
          </div>
        )}
      </div>
      {file && <p className='selectedFile'>Selected file: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default UploadPage;
