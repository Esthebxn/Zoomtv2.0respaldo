import React from 'react';
import './RedesSociales.css';

const RedesSociales = () => {
  const feedImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', link: 'https://www.youtube.com/@goyozoom' },
    { id: 2, url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', link: 'https://twitter.com' },
    { id: 3, url: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80', link: 'https://instagram.com' },
    { id: 5, url: 'https://images.unsplash.com/photo-1655199798153-a8f56d8655d2?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZhY2Vib29rJTIwaWNvbnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000', link: 'https://www.facebook.com/zoomtvcanal10' }, // Facebook feed
  ];

  return (
    <div className="redes-container">
      <div className="social-feed">
        <div className="feed-grid">
          {feedImages.map(image => (
            <div key={image.id} className="feed-item">
              <a href={image.link} target="_blank" rel="noopener noreferrer">
                <img src={image.url} alt={`Publicación ${image.id}`} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedesSociales; 