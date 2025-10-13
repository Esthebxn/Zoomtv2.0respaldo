import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon, Check } from 'lucide-react';

const ImageUploader = ({ 
  value = '', 
  onChange, 
  placeholder = "Selecciona una imagen o ingresa una URL",
  className = "",
  accept = "image/*"
}) => {
  const [uploadMode, setUploadMode] = useState('url'); // 'url' o 'file'
  const [preview, setPreview] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleModeChange = (mode) => {
    setUploadMode(mode);
    if (mode === 'url') {
      onChange(value);
    } else {
      onChange('');
    }
  };

  const handleUrlChange = (url) => {
    setPreview(url);
    onChange(url);
  };

  const handleFileSelect = async (file) => {
    if (file && file.type.startsWith('image/')) {
      // Mostrar preview inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Subir archivo al servidor
      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:3000/api/upload/image', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          onChange(result.data.url); // Guardar URL del servidor
        } else {
          const error = await response.json();
          alert(`Error subiendo imagen: ${error.error}`);
        }
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        alert('Error subiendo imagen al servidor');
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`image-uploader ${className}`}>
      {/* Modo selector */}
      <div className="upload-mode-selector">
        <button
          type="button"
          className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
          onClick={() => handleModeChange('url')}
        >
          <Link className="icon" />
          URL
        </button>
        <button
          type="button"
          className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
          onClick={() => handleModeChange('file')}
        >
          <Upload className="icon" />
          Subir Archivo
        </button>
      </div>

      {/* URL Input */}
      {uploadMode === 'url' && (
        <div className="url-input-section">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="form-input"
          />
        </div>
      )}

      {/* File Upload */}
      {uploadMode === 'file' && (
        <div
          className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="file-input"
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            <Upload className="upload-icon" />
            <p className="upload-text">
              {dragActive ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
            </p>
            <p className="upload-hint">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="image-preview">
          <div className="preview-header">
            <span className="preview-label">Vista previa:</span>
            <button
              type="button"
              onClick={clearImage}
              className="clear-btn"
              title="Eliminar imagen"
            >
              <X className="icon" />
            </button>
          </div>
          <div className="preview-image">
            <img src={preview} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
