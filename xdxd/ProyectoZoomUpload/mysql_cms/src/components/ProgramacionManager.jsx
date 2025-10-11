import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import apiService from '../services/api';

const ProgramacionManager = () => {
  const [programacion, setProgramacion] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('lunes');
  const [showModal, setShowModal] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState(null);
  const [formData, setFormData] = useState({
    dia_semana: '',
    hora: '',
    nombre_programa: '',
    descripcion: '',
    categoria: '',
    conductor: '',
    activo: true
  });

  const dias = [
    { id: 'lunes', name: 'Lunes' },
    { id: 'martes', name: 'Martes' },
    { id: 'miercoles', name: 'Miércoles' },
    { id: 'jueves', name: 'Jueves' },
    { id: 'viernes', name: 'Viernes' },
    { id: 'sabado', name: 'Sábado' },
    { id: 'domingo', name: 'Domingo' }
  ];

  const categorias = [
    'Entretenimiento', 'Noticias', 'Variedades', 'Drama', 'Deportes',
    'Cine', 'Música', 'Cocina', 'Tecnología', 'Documental', 'Salud',
    'Comedia', 'Infantil', 'Familia'
  ];

  useEffect(() => {
    loadProgramacion();
  }, []);

  const loadProgramacion = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProgramacion();
      
      // Organizar por día
      const programacionPorDia = {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
      };

      data.forEach(programa => {
        const diaMapping = {
          'Lunes': 'lunes',
          'Martes': 'martes', 
          'Miércoles': 'miercoles',
          'Jueves': 'jueves',
          'Viernes': 'viernes',
          'Sábado': 'sabado',
          'Domingo': 'domingo'
        };
        
        const dia = diaMapping[programa.dia_semana] || programa.dia_semana.toLowerCase();
        if (programacionPorDia[dia]) {
          programacionPorDia[dia].push(programa);
        }
      });

      setProgramacion(programacionPorDia);
    } catch (error) {
      console.error('Error loading programacion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre_programa.trim()) {
      alert('El nombre del programa es requerido');
      return;
    }
    if (!formData.dia_semana) {
      alert('El día de la semana es requerido');
      return;
    }
    if (!formData.hora) {
      alert('La hora es requerida');
      return;
    }

    try {
      // Preparar datos para el API
      const apiData = {
        nombre_programa: formData.nombre_programa.trim(),
        descripcion: formData.descripcion.trim(),
        horario_inicio: formData.hora,
        horario_fin: formData.hora, // Usar la misma hora como fin
        dia_semana: formData.dia_semana,
        conductor: formData.conductor.trim() || '',
        categoria: formData.categoria || '',
        activo: formData.activo,
        hora: formData.hora,
        programa: formData.nombre_programa.trim()
      };

      if (editingPrograma) {
        await apiService.updateProgramacion(editingPrograma.id, apiData);
        alert('Programa actualizado exitosamente');
      } else {
        await apiService.createProgramacion(apiData);
        alert('Programa creado exitosamente');
      }
      await loadProgramacion();
      resetForm();
    } catch (error) {
      console.error('Error saving programa:', error);
      alert('Error al guardar el programa. Verifique los datos e intente nuevamente.');
    }
  };

  const handleEdit = (programa) => {
    setEditingPrograma(programa);
    setFormData({
      dia_semana: programa.dia_semana || '',
      hora: programa.horario_inicio || programa.hora || '',
      nombre_programa: programa.nombre_programa || '',
      descripcion: programa.descripcion || '',
      categoria: programa.categoria || '',
      conductor: programa.conductor || '',
      activo: programa.activo !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
      try {
        await apiService.deleteProgramacion(id);
        await loadProgramacion();
      } catch (error) {
        console.error('Error deleting programa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dia_semana: '',
      hora: '',
      nombre_programa: '',
      descripcion: '',
      categoria: '',
      conductor: '',
      activo: true
    });
    setEditingPrograma(null);
    setShowModal(false);
  };

  const currentDayPrograms = programacion[selectedDay] || [];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando programación...</p>
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
          <h2>Gestión de Programación</h2>
          <p>Administra la programación semanal del canal</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="primary-btn"
        >
          <Plus className="icon" />
          Nuevo Programa
        </button>
      </div>

      {/* Day Selector */}
      <div className="day-selector">
        <div className="selector-header">
          <h3>Seleccionar Día</h3>
          <div className="day-navigation">
            <button
              onClick={() => {
                const currentIndex = dias.findIndex(d => d.id === selectedDay);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : dias.length - 1;
                setSelectedDay(dias[prevIndex].id);
              }}
              className="nav-btn"
            >
              <ChevronLeft className="icon" />
            </button>
            <button
              onClick={() => {
                const currentIndex = dias.findIndex(d => d.id === selectedDay);
                const nextIndex = currentIndex < dias.length - 1 ? currentIndex + 1 : 0;
                setSelectedDay(dias[nextIndex].id);
              }}
              className="nav-btn"
            >
              <ChevronRight className="icon" />
            </button>
          </div>
        </div>
        
        <div className="days-grid">
          {dias.map((dia) => (
            <button
              key={dia.id}
              onClick={() => setSelectedDay(dia.id)}
              className={`day-btn ${selectedDay === dia.id ? 'active' : ''}`}
            >
              <div className="day-name">{dia.name}</div>
              <div className="day-count">
                {programacion[dia.id]?.length || 0} programas
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Programs List */}
      <div className="programs-section">
        <div className="section-header">
          <h3>Programación - {dias.find(d => d.id === selectedDay)?.name}</h3>
          <span className="program-count">
            {currentDayPrograms.length} programas
          </span>
        </div>

        {currentDayPrograms.length > 0 ? (
          <div className="programs-list">
            {currentDayPrograms
              .sort((a, b) => a.hora.localeCompare(b.hora))
              .map((programa, index) => (
                <motion.div
                  key={programa.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="program-item"
                >
                  <div className="program-content">
                    <div className="program-time">
                      <Clock className="icon" />
                      <span className="time-text">{programa.hora}</span>
                    </div>
                    <div className="program-info">
                      <h4 className="program-name">{programa.nombre_programa}</h4>
                      <p className="program-description">{programa.descripcion}</p>
                      <div className="program-tags">
                        <span className="tag category">{programa.categoria}</span>
                        {programa.activo && (
                          <span className="tag active">Activo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="program-actions">
                    <button
                      onClick={() => handleEdit(programa)}
                      className="action-btn edit"
                    >
                      <Edit className="icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(programa.id)}
                      className="action-btn delete"
                    >
                      <Trash2 className="icon" />
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="empty-state">
            <Calendar className="empty-icon" />
            <h3>No hay programas</h3>
            <p>No hay programas programados para {dias.find(d => d.id === selectedDay)?.name}</p>
            <button
              onClick={() => setShowModal(true)}
              className="primary-btn"
            >
              Agregar Primer Programa
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal-content large"
          >
            <div className="modal-header">
              <h3>{editingPrograma ? 'Editar Programa' : 'Nuevo Programa'}</h3>
              <button onClick={resetForm} className="close-btn">
                <X className="icon" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Día de la Semana</label>
                  <select
                    value={formData.dia_semana}
                    onChange={(e) => setFormData({...formData, dia_semana: e.target.value})}
                    required
                    className="form-select"
                  >
                    <option value="">Seleccionar día</option>
                    {dias.map(dia => (
                      <option key={dia.id} value={dia.name}>{dia.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nombre del Programa</label>
                <input
                  type="text"
                  value={formData.nombre_programa}
                  onChange={(e) => setFormData({...formData, nombre_programa: e.target.value})}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="form-select"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Conductor</label>
                  <input
                    type="text"
                    value={formData.conductor}
                    onChange={(e) => setFormData({...formData, conductor: e.target.value})}
                    className="form-input"
                    placeholder="Nombre del conductor"
                  />
                </div>
              </div>


              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                  />
                  <span>Programa activo</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Cancelar
                </button>
                <button type="submit" className="primary-btn">
                  {editingPrograma ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgramacionManager;