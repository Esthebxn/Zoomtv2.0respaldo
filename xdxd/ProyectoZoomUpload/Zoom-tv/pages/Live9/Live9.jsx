import React, { useState, useEffect } from "react";
import "./Live9.css";
import apiService from "../../services/api";

const Live9 = () => {
  const [liveStreamData, setLiveStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLiveStream = async () => {
      try {
        setLoading(true);
        const data = await apiService.getLiveStream();
        setLiveStreamData(data);
      } catch (err) {
        console.error('Error cargando live stream:', err);
        setError('Error al cargar la transmisiÃ³n en vivo');
      } finally {
        setLoading(false);
      }
    };

    loadLiveStream();
  }, []);

  if (loading) {
    return (
      <div className="live9-container-alt">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando transmisiÃ³n en vivo...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="live9-container-alt">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  if (!liveStreamData) {
    return (
      <div className="live9-container-alt">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay transmisiÃ³n en vivo disponible</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="live9-container-alt">
      <div className="live9-player-alt">
        {/* Branding dentro del reproductor */}
        <div className="live9-brand-inside">ðŸ“º {liveStreamData.titulo}</div>

        {/* Iframe dinÃ¡mico desde la API */}
        <iframe
          src={liveStreamData.url_stream}
          className="live9-video-alt"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={liveStreamData.titulo}
        ></iframe>
      </div>
    </div>
  );
};

export default Live9;
 
