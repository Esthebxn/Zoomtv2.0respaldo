import React, { useState, useEffect } from "react";
import "./Musica.css";
import apiService from "../../services/api";

export default function Musica() {
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar noticias de música de la API
  useEffect(() => {
    const loadNoticias = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNoticias({ categoria: 'Música' });
        setNoticias(data);
      } catch (err) {
        console.error('Error cargando noticias de música:', err);
        setError('Error al cargar las noticias de música');
      } finally {
        setLoading(false);
      }
    };

    loadNoticias();
  }, []);


  if (loading) {
    return (
      <div className="actualidad-container">
        <header className="header-actualidad">
          <h1>MÚSICA</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando noticias de música...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="actualidad-container">
        <header className="header-actualidad">
          <h1>MÚSICA</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  if (!noticias || noticias.length === 0) {
    return (
      <div className="actualidad-container">
        <header className="header-actualidad">
          <h1>MÚSICA</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay noticias de música disponibles</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="actualidad-container">
      <header className="header-actualidad">
        <h1>MÚSICA</h1>
      </header>

      {/* TARJETAS */}
      <div className="noticias-grid">
        {noticias.map((noticia) => (
          <article key={noticia.id} className="noticia-card">
            <div
              className="noticia-img-container"
              onClick={() => setNoticiaSeleccionada(noticia)}
            >
              <img
                src={noticia.imagen_url || noticia.imagen}
                alt={noticia.titulo}
                className="noticia-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x200/333333/ffffff?text=Noticia+Música";
                }}
              />
              <div className="noticia-overlay">
                <span>Leer más</span>
              </div>
            </div>
            <div className="noticia-info-solo">
              <h2>{noticia.titulo}</h2>
            </div>
          </article>
        ))}
      </div>

      {/* MODAL */}
      {noticiaSeleccionada && (
        <div
          className="modal-overlay"
          onClick={() => setNoticiaSeleccionada(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setNoticiaSeleccionada(null)}
            >
              ✕
            </button>
            <img
              src={noticiaSeleccionada.imagen_url || noticiaSeleccionada.imagen}
              alt={noticiaSeleccionada.titulo}
              className="modal-img"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x300/333333/ffffff?text=Noticia+Música";
              }}
            />
            <h2 className="modal-titulo">{noticiaSeleccionada.titulo}</h2>
            <p className="modal-meta">
              🗓 {noticiaSeleccionada.fecha} | 📰 {noticiaSeleccionada.fuente}
            </p>
            <p className="modal-desc">{noticiaSeleccionada.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
} 