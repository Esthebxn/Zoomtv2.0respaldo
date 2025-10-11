import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Tag,
  Star,
  CheckCircle,
  X
} from 'lucide-react';
import apiService from '../services/api';
import ImageUploader from './ImageUploader';

const NoticiasManager = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    categoria: '',
    autor: '',
    imagen_url: '',
    fecha_publicacion: '',
    destacada: false,
    activa: true,
    descripcion: '',
    imagen: '',
    fecha: '',
    fuente: ''
  });

  const categorias = ['Actualidad', 'Deportes', 'Música', 'Nacionales', 'Regionales'];

  useEffect(() => {
    loadNoticias();
  }, []);

  const loadNoticias = async () => {
    try {
      setLoading(true);
      const data = await apiService.getNoticias();
      setNoticias(data);
    } catch (error) {
      console.error('Error loading noticias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.titulo.trim()) {
      alert('El título es requerido');
      return;
    }
    if (!formData.contenido.trim()) {
      alert('El contenido es requerido');
      return;
    }
    if (!formData.categoria) {
      alert('La categoría es requerida');
      return;
    }

    try {
      const dataToSave = {
        titulo: formData.titulo.trim(),
        contenido: formData.contenido.trim(),
        resumen: formData.resumen.trim(),
        categoria: formData.categoria,
        autor: formData.autor.trim() || 'Admin',
        imagen_url: formData.imagen_url.trim(),
        fecha_publicacion: formData.fecha_publicacion || new Date().toISOString(),
        destacada: formData.destacada,
        activa: formData.activa,
        descripcion: formData.descripcion.trim(),
        imagen: formData.imagen.trim(),
        fecha: formData.fecha.trim(),
        fuente: formData.fuente.trim()
      };

      if (editingNoticia) {
        await apiService.updateNoticia(editingNoticia.id, dataToSave);
        alert('Noticia actualizada exitosamente');
      } else {
        await apiService.createNoticia(dataToSave);
        alert('Noticia creada exitosamente');
      }
      await loadNoticias();
      resetForm();
    } catch (error) {
      console.error('Error saving noticia:', error);
      alert('Error al guardar la noticia. Verifique los datos e intente nuevamente.');
    }
  };

  const handleEdit = (noticia) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo || '',
      contenido: noticia.contenido || '',
      resumen: noticia.resumen || '',
      categoria: noticia.categoria || '',
      autor: noticia.autor || '',
      imagen_url: noticia.imagen_url || '',
      fecha_publicacion: noticia.fecha_publicacion ? noticia.fecha_publicacion.split('T')[0] : '',
      destacada: noticia.destacada || false,
      activa: noticia.activa !== false,
      descripcion: noticia.descripcion || '',
      imagen: noticia.imagen || '',
      fecha: noticia.fecha || '',
      fuente: noticia.fuente || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        await apiService.deleteNoticia(id);
        await loadNoticias();
      } catch (error) {
        console.error('Error deleting noticia:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      contenido: '',
      resumen: '',
      categoria: '',
      autor: '',
      imagen_url: '',
      fecha_publicacion: '',
      destacada: false,
      activa: true,
      descripcion: '',
      imagen: '',
      fecha: '',
      fuente: ''
    });
    setEditingNoticia(null);
    setShowModal(false);
  };

  const filteredNoticias = noticias.filter(noticia => {
    const matchesSearch = noticia.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         noticia.contenido?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategoria || noticia.categoria === filterCategoria;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="manager-container"
    >
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <h2>Gestión de Noticias</h2>
          <p>Administra todas las noticias del sitio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="primary-btn"
        >
          <Plus className="icon" />
          Nueva Noticia
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-select">
          <Filter className="filter-icon" />
          <select
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="select-input"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="filter-info">
          <span>Total: {filteredNoticias.length}</span>
        </div>
      </div>

      {/* Noticias Grid */}
      <div className="items-grid">
        {filteredNoticias.map((noticia, index) => (
          <motion.div
            key={noticia.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="news-card"
          >
            <div className="card-header">
              <div className="card-category">
                <Tag className="icon" />
                <span>{noticia.categoria}</span>
              </div>
              <div className="card-badges">
                {noticia.destacada && (
                  <Star className="icon featured" />
                )}
                {noticia.activa && (
                  <CheckCircle className="icon active" />
                )}
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{noticia.titulo}</h3>
              <p className="card-description">{noticia.contenido}</p>
            </div>

            <div className="card-meta">
              <div className="meta-item">
                <Calendar className="icon" />
                <span>{noticia.fecha}</span>
              </div>
              <span className="meta-author">{noticia.autor}</span>
            </div>

            <div className="card-actions">
              <button
                onClick={() => handleEdit(noticia)}
                className="action-btn edit"
              >
                <Edit className="icon" />
              </button>
              <button
                onClick={() => handleDelete(noticia.id)}
                className="action-btn delete"
              >
                <Trash2 className="icon" />
              </button>
              <button className="action-btn view">
                <Eye className="icon" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNoticias.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Eye className="icon" />
          </div>
          <h3>No hay noticias</h3>
          <p>
            {searchTerm || filterCategoria 
              ? 'No se encontraron noticias con los filtros aplicados'
              : 'Comienza creando tu primera noticia'
            }
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="primary-btn"
          >
            Crear Primera Noticia
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content large"
          >
            <div className="modal-header">
              <h3>{editingNoticia ? 'Editar Noticia' : 'Nueva Noticia'}</h3>
              <button onClick={resetForm} className="close-btn">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    required
                    className="form-select"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Resumen</label>
                <textarea
                  value={formData.resumen}
                  onChange={(e) => setFormData({...formData, resumen: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Resumen corto de la noticia"
                />
              </div>

              <div className="form-group">
                <label>Contenido</label>
                <textarea
                  value={formData.contenido}
                  onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                  rows={6}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Autor</label>
                  <input
                    type="text"
                    value={formData.autor}
                    onChange={(e) => setFormData({...formData, autor: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Publicación</label>
                  <input
                    type="date"
                    value={formData.fecha_publicacion}
                    onChange={(e) => setFormData({...formData, fecha_publicacion: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Imagen</label>
                <ImageUploader
                  value={formData.imagen_url}
                  onChange={(value) => setFormData({...formData, imagen_url: value})}
                  placeholder="Selecciona una imagen o ingresa una URL"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de Imagen</label>
                  <input
                    type="text"
                    value={formData.imagen}
                    onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                    className="form-input"
                    placeholder="imagen.jpg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha para Mostrar</label>
                  <input
                    type="text"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="form-input"
                    placeholder="03 octubre 2025"
                  />
                </div>
                <div className="form-group">
                  <label>Fuente</label>
                  <input
                    type="text"
                    value={formData.fuente}
                    onChange={(e) => setFormData({...formData, fuente: e.target.value})}
                    className="form-input"
                    placeholder="Andina.pe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción para Mostrar</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Descripción corta que se muestra en las tarjetas"
                />
              </div>

              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.destacada}
                    onChange={(e) => setFormData({...formData, destacada: e.target.checked})}
                  />
                  <span>Noticia destacada</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.activa}
                    onChange={(e) => setFormData({...formData, activa: e.target.checked})}
                  />
                  <span>Noticia activa</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  {editingNoticia ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default NoticiasManager;