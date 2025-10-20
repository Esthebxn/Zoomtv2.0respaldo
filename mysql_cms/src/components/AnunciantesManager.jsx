import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Eye, X } from 'lucide-react';
import apiService from '../services/api';
import ImageUploader from './ImageUploader';

const AnunciantesManager = () => {
  const [anunciantes, setAnunciantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAnunciante, setEditingAnunciante] = useState(null);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    descripcion: '',
    logo_url: '',
    sitio_web: '',
    activo: true,
    nombre: '',
    categoria: '',
    horario: '',
    imagen: '',
    flyer: ''
  });

  useEffect(() => {
    fetchAnunciantes();
  }, []);

  const fetchAnunciantes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnunciantes();
      setAnunciantes(data);
    } catch (error) {
      console.error('Error fetching anunciantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre_empresa.trim()) {
      alert('El nombre de la empresa es requerido');
      return;
    }

    try {
      const dataToSave = {
        nombre_empresa: formData.nombre_empresa.trim(),
        contacto: formData.contacto.trim(),
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        direccion: formData.direccion.trim(),
        descripcion: formData.descripcion.trim(),
        logo_url: formData.logo_url.trim(),
        sitio_web: formData.sitio_web.trim(),
        activo: formData.activo,
        nombre: formData.nombre.trim() || formData.nombre_empresa.trim(),
        categoria: formData.categoria.trim(),
        horario: formData.horario.trim(),
        imagen: formData.imagen.trim(),
        flyer: formData.flyer.trim()
      };

      if (editingAnunciante) {
        await apiService.updateAnunciante(editingAnunciante.id, dataToSave);
        alert('Anunciante actualizado exitosamente');
      } else {
        await apiService.createAnunciante(dataToSave);
        alert('Anunciante creado exitosamente');
      }
      await fetchAnunciantes();
      resetForm();
    } catch (error) {
      console.error('Error saving anunciante:', error);
      alert('Error al guardar el anunciante. Verifique los datos e intente nuevamente.');
    }
  };

  const handleEdit = (anunciante) => {
    setEditingAnunciante(anunciante);
    setFormData({
      nombre_empresa: anunciante.nombre_empresa || '',
      contacto: anunciante.contacto || '',
      telefono: anunciante.telefono || '',
      email: anunciante.email || '',
      direccion: anunciante.direccion || '',
      descripcion: anunciante.descripcion || '',
      logo_url: anunciante.logo_url || '',
      sitio_web: anunciante.sitio_web || '',
      activo: anunciante.activo !== false,
      nombre: anunciante.nombre || '',
      categoria: anunciante.categoria || '',
      horario: anunciante.horario || '',
      imagen: anunciante.imagen || '',
      flyer: anunciante.flyer || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este anunciante?')) {
      try {
        await apiService.deleteAnunciante(id);
        await fetchAnunciantes();
      } catch (error) {
        console.error('Error deleting anunciante:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre_empresa: '',
      contacto: '',
      telefono: '',
      email: '',
      direccion: '',
      descripcion: '',
      logo_url: '',
      sitio_web: '',
      activo: true,
      nombre: '',
      categoria: '',
      horario: '',
      imagen: '',
      flyer: ''
    });
    setEditingAnunciante(null);
    setShowForm(false);
  };

  const filteredAnunciantes = anunciantes.filter(anunciante => {
    const nombre = anunciante.nombre || '';
    const categoria = anunciante.categoria || '';
    const searchLower = searchTerm.toLowerCase();
    
    return nombre.toLowerCase().includes(searchLower) ||
           categoria.toLowerCase().includes(searchLower) ||
           (anunciante.nombre_empresa || '').toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando anunciantes...</p>
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
          <h2>Gestión de Anunciantes</h2>
          <p>Administra los anunciantes de ZoomTV</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="primary-btn"
        >
          <Plus className="icon" />
          Nuevo Anunciante
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar anunciantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-btn">
          <Filter className="icon" />
          Filtros
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content"
          >
            <div className="modal-header">
              <h3>{editingAnunciante ? 'Editar Anunciante' : 'Nuevo Anunciante'}</h3>
              <button onClick={resetForm} className="close-btn">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de la Empresa *</label>
                  <input
                    type="text"
                    value={formData.nombre_empresa}
                    onChange={(e) => setFormData({...formData, nombre_empresa: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre para Mostrar</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="form-input"
                    placeholder="Igual que nombre de empresa si no se especifica"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contacto</label>
                  <input
                    type="text"
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Sitio Web</label>
                  <input
                    type="url"
                    value={formData.sitio_web}
                    onChange={(e) => setFormData({...formData, sitio_web: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  rows={2}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="form-input"
                    placeholder="Gastronomía, Automotriz, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Horario</label>
                  <input
                    type="text"
                    value={formData.horario}
                    onChange={(e) => setFormData({...formData, horario: e.target.value})}
                    className="form-input"
                    placeholder="Lun-Dom: 8:00 AM - 6:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Logo</label>
                <ImageUploader
                  value={formData.logo_url}
                  onChange={(value) => setFormData({...formData, logo_url: value})}
                  placeholder="Selecciona un logo o ingresa una URL"
                />
              </div>

              <div className="form-group">
                <label>Imagen Principal</label>
                <ImageUploader
                  value={formData.imagen}
                  onChange={(value) => setFormData({...formData, imagen: value})}
                  placeholder="Selecciona una imagen principal o ingresa una URL"
                />
              </div>

              <div className="form-group">
                <label>Flyer</label>
                <ImageUploader
                  value={formData.flyer}
                  onChange={(value) => setFormData({...formData, flyer: value})}
                  placeholder="Selecciona un flyer o ingresa una URL"
                />
              </div>

              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  />
                  <span>Anunciante activo</span>
                </label>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  {editingAnunciante ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Anunciantes Grid */}
      <div className="items-grid">
        {filteredAnunciantes.map((anunciante) => (
          <motion.div
            key={anunciante.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="item-card"
          >
            <div className="card-image">
              {anunciante.imagen ? (
                <img src={anunciante.imagen} alt={anunciante.nombre} />
              ) : (
                <div className="placeholder-image">
                  <Eye className="icon" />
                </div>
              )}
            </div>
            <div className="card-content">
              <h3>{anunciante.nombre}</h3>
              <p className="category">{anunciante.categoria}</p>
              {anunciante.horario && (
                <p className="horario">{anunciante.horario}</p>
              )}
            </div>
            <div className="card-actions">
              <button
                onClick={() => handleEdit(anunciante)}
                className="action-btn edit"
              >
                <Edit className="icon" />
              </button>
              <button
                onClick={() => handleDelete(anunciante.id)}
                className="action-btn delete"
              >
                <Trash2 className="icon" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAnunciantes.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron anunciantes</p>
        </div>
      )}
    </motion.div>
  );
};

export default AnunciantesManager;
