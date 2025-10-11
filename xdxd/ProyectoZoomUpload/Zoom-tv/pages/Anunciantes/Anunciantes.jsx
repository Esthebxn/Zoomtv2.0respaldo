import React, { useState, useEffect } from "react";
import "./Anunciantes.css";
import apiService from "../../services/api";

export default function Anunciantes() {
  const [selectedAnunciante, setSelectedAnunciante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anunciantesData, setAnunciantesData] = useState([]);

  // Cargar anunciantes de la API
  useEffect(() => {
    const loadAnunciantes = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAnunciantes();
        setAnunciantesData(data);
      } catch (err) {
        console.error('Error cargando anunciantes:', err);
        setError('Error al cargar los anunciantes');
      } finally {
        setLoading(false);
      }
    };

    loadAnunciantes();
  }, []);


  // FunciÃ³n para reintentar carga
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const loadAnunciantes = async () => {
      try {
        const data = await apiService.getAnunciantes();
        setAnunciantesData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando anunciantes:', err);
        setError('Error al cargar los anunciantes');
        setLoading(false);
      }
    };
    loadAnunciantes();
  };

  const handleAnuncianteClick = (anunciante) => {
    setSelectedAnunciante(anunciante);
  };

  const handleCloseModal = () => {
    setSelectedAnunciante(null);
  };


  // Manejar clics en el modal para cerrar
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (selectedAnunciante) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedAnunciante]);

  if (error) {
    return (
      <div className="anunciantes-container">
        <div className="error-container">
          <div className="error-message">
            {error}
          </div>
          <button className="retry-button" onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!anunciantesData || anunciantesData.length === 0) {
    return (
      <div className="anunciantes-container">
        <header className="anunciantes-header">
          <h1>ANUNCIANTES</h1>
          <p>Conoce a nuestros patrocinadores y aliados comerciales</p>
        </header>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay anunciantes disponibles</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="actualidad-container">
      {/* Header con diseÃ±o de Actualidad - TÃ­tulo rojo */}
      <header className="header-actualidad">
        <h1>ANUNCIANTES</h1>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando anunciantes...</p>
        </div>
      ) : (
        <div className="noticias-grid">
          {anunciantesData.map((anunciante) => (
            <article 
              key={anunciante.id} 
              className="noticia-card"
              onClick={() => handleAnuncianteClick(anunciante)}
            >
              <img
                src={anunciante.imagen || anunciante.logo_url}
                alt={anunciante.nombre}
                className="noticia-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x200/333333/ffffff?text=Imagen+Anunciante";
                }}
              />
              <div className="noticia-info">
                <h2>{anunciante.nombre}</h2>
                <p className="noticia-meta">ðŸ·ï¸ {anunciante.categoria}</p>
                <p className="noticia-desc">{anunciante.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal para mostrar detalles del anunciante */}
      {selectedAnunciante && (
        <div 
          className="modal-overlay"
          onClick={handleCloseModal}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={handleCloseModal}
            >
              âœ•
            </button>
            <img
              src={selectedAnunciante.flyer || selectedAnunciante.imagen}
              alt={`Flyer de ${selectedAnunciante.nombre}`}
              className="modal-img"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x300/333333/ffffff?text=Flyer+No+Disponible";
              }}
            />
            <h2 className="modal-titulo">{selectedAnunciante.nombre}</h2>
            <p className="modal-meta">
              ðŸ·ï¸ {selectedAnunciante.categoria}
            </p>
            <p className="modal-desc">
              {selectedAnunciante.descripcion}
            </p>
            <div className="modal-contact-info">
              <p><strong>ðŸ“ž TelÃ©fono:</strong> {selectedAnunciante.telefono}</p>
              <p><strong>ðŸ“ DirecciÃ³n:</strong> {selectedAnunciante.direccion}</p>
              <p><strong>ðŸ•’ Horario:</strong> {selectedAnunciante.horario}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
