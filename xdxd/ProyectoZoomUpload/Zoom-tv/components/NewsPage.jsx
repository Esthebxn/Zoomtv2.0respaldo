import React from 'react';
import { useNewsCategory } from '../hooks/useNewsCategory';

const NewsPage = ({ 
  category, 
  title, 
  subtitle, 
  containerClassName, 
  headerClassName 
}) => {
  const {
    noticias,
    noticiaSeleccionada,
    setNoticiaSeleccionada,
    loading,
    error,
    setError,
    pagination,
    formatearFecha,
    cambiarPagina,
    handleNoticiaClick,
    cargarNoticias
  } = useNewsCategory(category);

  if (loading && noticias.length === 0) {
    return (
      <div className={containerClassName}>
        <header className={headerClassName}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando noticias...</p>
        </div>
      </div>
    );
  }

  if (error && noticias.length === 0) {
    return (
      <div className={containerClassName}>
        <header className={headerClassName}>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </header>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => cargarNoticias()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <header className={headerClassName}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
      
      <div className="noticias-contenido">
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>&times;</button>
          </div>
        )}
        
        <div className="noticias-lista">
        {noticias.map((noticia, index) => (
          <article key={noticia._id || noticia.id} className={`noticia-item ${index === 0 ? 'destacada' : ''}`}>
            <div className="noticia-imagen">
              {noticia.imageUrl ? (
                <img 
                  src={noticia.imageUrl} 
                  alt={noticia.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="imagen-placeholder" style={{ display: noticia.imageUrl ? 'none' : 'flex' }}>
                <span>Sin imagen</span>
              </div>
            </div>
            <div className="noticia-contenido">
              <h2 className="noticia-titulo">{noticia.title}</h2>
              <p className="noticia-resumen">{noticia.summary}</p>
              <div className="noticia-meta">
                <span className="noticia-autor">Por {noticia.author}</span>
                <span className="noticia-fecha">{formatearFecha(noticia.date || noticia.createdAt)}</span>
              </div>
              <button 
                className="noticia-boton"
                onClick={() => handleNoticiaClick(noticia)}
              >
                Leer mÃ¡s
              </button>
            </div>
          </article>
        ))}
        </div>

        {/* PaginaciÃ³n */}
        {pagination.pages > 1 && (
          <div className="paginacion">
            <button 
              className="pagina-btn"
              disabled={pagination.page <= 1}
              onClick={() => cambiarPagina(pagination.page - 1)}
            >
              Anterior
            </button>
            
            <span className="pagina-info">
              PÃ¡gina {pagination.page} de {pagination.pages}
            </span>
            
            <button 
              className="pagina-btn"
              disabled={pagination.page >= pagination.pages}
              onClick={() => cambiarPagina(pagination.page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de noticia completa */}
      {noticiaSeleccionada && (
        <div className="modal" onClick={() => setNoticiaSeleccionada(null)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-cerrar"
              onClick={() => setNoticiaSeleccionada(null)}
            >
              &times;
            </button>
            {noticiaSeleccionada.imageUrl ? (
              <img 
                src={noticiaSeleccionada.imageUrl} 
                alt={noticiaSeleccionada.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="modal-imagen-placeholder" style={{ display: noticiaSeleccionada.imageUrl ? 'none' : 'flex' }}>
              <span>Imagen no disponible</span>
            </div>
            <div className="modal-texto">
              <h2>{noticiaSeleccionada.title}</h2>
              <div className="modal-meta">
                <span>Por {noticiaSeleccionada.author}</span>
                <span>{formatearFecha(noticiaSeleccionada.date || noticiaSeleccionada.createdAt)}</span>
              </div>
              <p className="modal-resumen">{noticiaSeleccionada.summary}</p>
              <div 
                className="modal-contenido-texto"
                dangerouslySetInnerHTML={{ __html: noticiaSeleccionada.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsPage;

