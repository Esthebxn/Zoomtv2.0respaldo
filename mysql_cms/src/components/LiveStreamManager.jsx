import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Edit,
  Trash2,
  Plus,
  X,
  Link,
  Eye,
  EyeOff
} from 'lucide-react';
import apiService from '../services/api';

const LiveStreamManager = () => {
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStream, setEditingStream] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    url_stream: '',
    descripcion: '',
    activo: true
  });

  useEffect(() => {
    fetchLiveStreams();
  }, []);

  const fetchLiveStreams = async () => {
    try {
      setLoading(true);
      console.log('Fetching live streams...');
      const data = await apiService.getAllLiveStreams();
      console.log('Live streams data received:', data);
      setLiveStreams(data);
    } catch (error) {
      console.error('Error fetching live streams:', error);
      setError('Error al cargar los live streams');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.titulo.trim() || !formData.url_stream.trim()) {
      alert('Título y URL del stream son requeridos');
      return;
    }

    try {
      if (editingStream) {
        await apiService.updateLiveStream(editingStream.id, formData);
        alert('Live stream actualizado exitosamente');
      } else {
        await apiService.createLiveStream(formData);
        alert('Live stream creado exitosamente');
      }
      
      resetForm();
      fetchLiveStreams();
    } catch (error) {
      console.error('Error saving live stream:', error);
      alert('Error al guardar el live stream');
    }
  };

  const handleEdit = (stream) => {
    setFormData({
      titulo: stream.titulo || '',
      url_stream: stream.url_stream || '',
      descripcion: stream.descripcion || '',
      activo: stream.activo
    });
    setEditingStream(stream);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este live stream?')) {
      try {
        await apiService.deleteLiveStream(id);
        alert('Live stream eliminado exitosamente');
        fetchLiveStreams();
      } catch (error) {
        console.error('Error deleting live stream:', error);
        alert('Error al eliminar el live stream');
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await apiService.activateLiveStream(id);
      alert('Live stream activado exitosamente');
      fetchLiveStreams();
    } catch (error) {
      console.error('Error activating live stream:', error);
      alert('Error al activar el live stream');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await apiService.deactivateLiveStream(id);
      alert('Live stream desactivado exitosamente');
      fetchLiveStreams();
    } catch (error) {
      console.error('Error deactivating live stream:', error);
      alert('Error al desactivar el live stream');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      url_stream: '',
      descripcion: '',
      activo: true
    });
    setEditingStream(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando live streams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-container">
        <div className="manager-header">
          <div className="header-left">
            <h2>Gestión de Live Stream</h2>
            <p>Error al cargar los datos</p>
          </div>
        </div>
        <div className="content">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={fetchLiveStreams} className="primary-btn">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="manager-container"
    >
      <div className="manager-header">
        <div className="header-left">
          <h2>Gestión de Live Stream</h2>
          <p>Administra las transmisiones en vivo</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setShowForm(true)}
            className="primary-btn"
          >
            <Plus className="icon" />
            Nuevo Live Stream
          </button>
        </div>
      </div>

      <div className="content">
        {liveStreams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📺</div>
            <h3>No hay live streams</h3>
            <p>Crea tu primer live stream para comenzar</p>
            <button
              onClick={() => setShowForm(true)}
              className="primary-btn"
            >
              <Plus className="icon" />
              Crear Live Stream
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="item-card">
                <div className="card-content">
                  <div className="card-header">
                    <h3>{stream.titulo}</h3>
                    <div className="card-badges">
                      {stream.activo ? (
                        <span className="badge active">
                          <Eye className="icon" />
                          Activo
                        </span>
                      ) : (
                        <span className="badge inactive">
                          <EyeOff className="icon" />
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-description">
                    <p><strong>URL:</strong> {stream.url_stream}</p>
                    {stream.descripcion && (
                      <p><strong>Descripción:</strong> {stream.descripcion}</p>
                    )}
                  </div>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <span>Creado: {new Date(stream.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  {stream.activo ? (
                    <button
                      onClick={() => handleDeactivate(stream.id)}
                      className="action-btn deactivate"
                      title="Desactivar"
                    >
                      <EyeOff className="icon" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(stream.id)}
                      className="action-btn activate"
                      title="Activar"
                    >
                      <Eye className="icon" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(stream)}
                    className="action-btn edit"
                    title="Editar"
                  >
                    <Edit className="icon" />
                  </button>
                  <button
                    onClick={() => handleDelete(stream.id)}
                    className="action-btn delete"
                    title="Eliminar"
                  >
                    <Trash2 className="icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal del formulario */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStream ? 'Editar Live Stream' : 'Nuevo Live Stream'}</h3>
              <button onClick={resetForm} className="close-btn">
                <X className="icon" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="form-input"
                  placeholder="Ej: Zoom TV Live Stream"
                  required
                />
              </div>

              <div className="form-group">
                <label>URL del Stream *</label>
                <input
                  type="url"
                  value={formData.url_stream}
                  onChange={(e) => setFormData({...formData, url_stream: e.target.value})}
                  className="form-input"
                  placeholder="https://player.kick.com/elmacarius?hideHeader=true&hideChat=true"
                  required
                />
                <div className="form-help">
                  URL completa del stream (iframe, embed, etc.)
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Descripción del live stream..."
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  />
                  <span>Stream activo</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  {editingStream ? 'Actualizar' : 'Crear'} Live Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LiveStreamManager;
