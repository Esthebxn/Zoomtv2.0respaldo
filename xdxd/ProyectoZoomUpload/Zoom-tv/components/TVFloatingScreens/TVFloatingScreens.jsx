// TVFloatingScreens.jsx
import React, { useEffect, useRef } from 'react';
import './TVFloatingScreens.css';

const TVFloatingScreens = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const createFloatingTVs = () => {
      const container = containerRef.current;
      if (!container) return;

      // Limpiar TVs existentes
      container.innerHTML = '';

      // Crear TVs flotantes
      const tvCount = 15; // Cantidad de TVs
      const sizes = ['small', 'medium', 'large'];
      const styles = ['modern', 'retro', 'flat'];
      
      for (let i = 0; i < tvCount; i++) {
        const tv = document.createElement('div');
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const style = styles[Math.floor(Math.random() * styles.length)];
        
        tv.className = `floating-tv ${size} ${style}`;
        
        // PosiciÃ³n aleatoria
        tv.style.left = `${Math.random() * 100}%`;
        tv.style.top = `${Math.random() * 100}%`;
        
        // Retraso de animaciÃ³n aleatorio
        tv.style.animationDelay = `${Math.random() * 20}s`;
        
        // Opacidad aleatoria
        tv.style.opacity = `${0.4 + Math.random() * 0.3}`;
        
        // Aplicar parpadeo aleatorio
        if (Math.random() > 0.7) {
          tv.style.animation = `floatTV ${15 + Math.random() * 20}s infinite ease-in-out, tvFlicker ${3 + Math.random() * 7}s infinite`;
        }
        
        container.appendChild(tv);
      }
    };

    createFloatingTVs();

    // Recrear TVs al redimensionar
    const handleResize = () => createFloatingTVs();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="tv-floating-container"></div>
      <div className="tv-interference-wave"></div>
      <div className="global-screen-border"></div>
    </>
  );
};

export default TVFloatingScreens; 
