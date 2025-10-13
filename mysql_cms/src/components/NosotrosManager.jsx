import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  X, 
  Building2,
  Mail,
  Phone,
  Users,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import apiService from '../services/api';
import ImageUploader from './ImageUploader';

const NosotrosManager = () => {
  const [nosotrosData, setNosotrosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNosotros, setEditingNosotros] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    mision: '',
    vision: '',
    valores: '',
    imagen_url: '',
    nombre_empresa: '',
    slogan: '',
    email: '',
    telefono: '',
    historia: '',
    equipo: ''
  });

  useEffect(() => {
    fetchNosotros();
  }, []);

  const fetchNosotros = async () => {
    try {
      setLoading(true);
      console.log('Fetching nosotros data...');
      const data = await apiService.getNosotros();
      console.log('Nosotros data received:', data);
      // La API devuelve un objeto individual, no un array
      setNosotrosData(data);
    } catch (error) {
      console.error('Error fetching nosotros:', error);
      setError('Error al cargar los datos de nosotros');
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
    if (!formData.nombre_empresa.trim()) {
      alert('El nombre de la empresa es requerido');
      return;
    }

    try {
      const dataToSave = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        mision: formData.mision.trim(),
        vision: formData.vision.trim(),
        valores: formData.valores.trim(),
        imagen_url: formData.imagen_url.trim(),
        nombre_empresa: formData.nombre_empresa.trim(),
        slogan: formData.slogan.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        historia: formData.historia.trim(),
        equipo: formData.equipo.trim()
      };

      if (editingNosotros) {
        await apiService.updateNosotros(editingNosotros.id, dataToSave);
        alert('Información actualizada exitosamente');
      } else {
        await apiService.createNosotros(dataToSave);
        alert('Información creada exitosamente');
      }
      await fetchNosotros();
      resetForm();
    } catch (error) {
      console.error('Error saving nosotros:', error);
      alert('Error al guardar la información. Verifique los datos e intente nuevamente.');
    }
  };

  const handleEdit = (nosotros) => {
    setEditingNosotros(nosotros);
    setFormData({
      titulo: nosotros.titulo || '',
      descripcion: nosotros.descripcion || '',
      mision: nosotros.mision || '',
      vision: nosotros.vision || '',
      valores: nosotros.valores || '',
      imagen_url: nosotros.imagen_url || '',
      nombre_empresa: nosotros.nombre_empresa || '',
      slogan: nosotros.slogan || '',
      email: nosotros.email || '',
      telefono: nosotros.telefono || '',
      historia: nosotros.historia || '',
      equipo: nosotros.equipo || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta información?')) {
      try {
        await apiService.deleteNosotros(id);
        await fetchNosotros();
        alert('Información eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting nosotros:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      mision: '',
      vision: '',
      valores: '',
      imagen_url: '',
      nombre_empresa: '',
      slogan: '',
      email: '',
      telefono: '',
      historia: '',
      equipo: ''
    });
    setEditingNosotros(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-container">
        <div className="manager-header">
          <div className="header-left">
            <h2>Gestión de Nosotros</h2>
            <p>Error al cargar los datos</p>
          </div>
        </div>
        <div className="content">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={fetchNosotros} className="primary-btn">
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
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <h2>Gestión de Información de la Empresa</h2>
          <p>Administra la información de ZoomTV</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="primary-btn"
        >
          <Plus className="icon" />
          {nosotrosData ? 'Editar Información' : 'Crear Información'}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content large"
          >
            <div className="modal-header">
              <h3>{editingNosotros ? 'Editar Información' : 'Nueva Información'}</h3>
              <button onClick={resetForm} className="close-btn">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    required
                    className="form-input"
                    placeholder="ZoomTV"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre de la Empresa *</label>
                  <input
                    type="text"
                    value={formData.nombre_empresa}
                    onChange={(e) => setFormData({...formData, nombre_empresa: e.target.value})}
                    required
                    className="form-input"
                    placeholder="Zoom TV Canal 10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Slogan</label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                  className="form-input"
                  placeholder="Información veraz, entretenimiento de calidad"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="form-input"
                    placeholder="contacto@zoomtvcanal10.com"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="form-input"
                    placeholder="+51 999 888 777"
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

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Somos una televisora local comprometida con la comunidad"
                />
              </div>

              <div className="form-group">
                <label>Misión</label>
                <textarea
                  value={formData.mision}
                  onChange={(e) => setFormData({...formData, mision: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Informar, entretener y educar a nuestra audiencia con contenido de calidad"
                />
              </div>

              <div className="form-group">
                <label>Visión</label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Ser la televisora líder en nuestra región"
                />
              </div>

              <div className="form-group">
                <label>Valores</label>
                <textarea
                  value={formData.valores}
                  onChange={(e) => setFormData({...formData, valores: e.target.value})}
                  rows={3}
                  className="form-textarea"
                  placeholder="Transparencia, compromiso, innovación y servicio a la comunidad"
                />
              </div>

              <div className="form-group">
                <label>Historia</label>
                <textarea
                  value={formData.historia}
                  onChange={(e) => setFormData({...formData, historia: e.target.value})}
                  rows={4}
                  className="form-textarea"
                  placeholder="Zoom TV Canal 10 nació en 2005 con la misión de llevar información veraz..."
                />
              </div>

               <div className="form-group">
                 <label>Equipo</label>
                 <textarea
                   value={formData.equipo}
                   onChange={(e) => setFormData({...formData, equipo: e.target.value})}
                   rows={4}
                   className="form-textarea"
                   placeholder="Descripción del equipo de trabajo..."
                 />
                 <div className="form-help">
                   Descripción del equipo de trabajo (texto simple)
                 </div>
               </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  {editingNosotros ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Display Current Information */}
      {nosotrosData ? (
        <div className="nosotros-content">
          <div className="info-cards">
            <div className="info-card">
              <div className="card-icon">
                <Building2 className="icon" />
              </div>
              <div className="card-content">
                <h3>{nosotrosData.nombre_empresa}</h3>
                <h4>{nosotrosData.titulo}</h4>
                <p className="slogan">"{nosotrosData.slogan}"</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <Mail className="icon" />
              </div>
              <div className="card-content">
                <h4>Contacto</h4>
                <p><strong>Email:</strong> {nosotrosData.email}</p>
                <p><strong>Teléfono:</strong> {nosotrosData.telefono}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <FileText className="icon" />
              </div>
              <div className="card-content">
                <h4>Descripción</h4>
                <p>{nosotrosData.descripcion}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <FileText className="icon" />
              </div>
              <div className="card-content">
                <h4>Misión</h4>
                <p>{nosotrosData.mision}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <FileText className="icon" />
              </div>
              <div className="card-content">
                <h4>Visión</h4>
                <p>{nosotrosData.vision}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="card-icon">
                <FileText className="icon" />
              </div>
              <div className="card-content">
                <h4>Valores</h4>
                <p>{nosotrosData.valores}</p>
              </div>
            </div>

            {nosotrosData.historia && (
              <div className="info-card">
                <div className="card-icon">
                  <FileText className="icon" />
                </div>
                <div className="card-content">
                  <h4>Historia</h4>
                  <p>{nosotrosData.historia}</p>
                </div>
              </div>
            )}

             {nosotrosData.equipo && (
               <div className="info-card">
                 <div className="card-icon">
                   <Users className="icon" />
                 </div>
                 <div className="card-content">
                   <h4>Equipo</h4>
                   <p>{nosotrosData.equipo}</p>
                 </div>
               </div>
             )}
          </div>

          <div className="action-buttons">
            <button
              onClick={() => handleEdit(nosotrosData)}
              className="action-btn edit"
            >
              <Edit className="icon" />
              Editar
            </button>
            <button
              onClick={() => handleDelete(nosotrosData.id)}
              className="action-btn delete"
            >
              <Trash2 className="icon" />
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Building2 className="icon" />
          </div>
          <h3>No hay información de la empresa</h3>
          <p>Comienza creando la información de ZoomTV</p>
          <button
            onClick={() => setShowForm(true)}
            className="primary-btn"
          >
            Crear Información
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NosotrosManager;