import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Newspaper, 
  Calendar, 
  Users, 
  Settings,
  Play,
  Menu,
  X,
  BarChart3,
  Eye,
  Plus,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';
import NoticiasManager from './NoticiasManager';
import ProgramacionManager from './ProgramacionManager';
import AnunciantesManager from './AnunciantesManager';
import NosotrosManager from './NosotrosManager';
import LiveStreamManager from './LiveStreamManager';
import apiService from '../services/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    noticias: 0,
    programas: 0,
    anunciantes: 0,
    nosotros: 0
  });
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'overview', name: 'Resumen', icon: Home },
    { id: 'noticias', name: 'Noticias', icon: Newspaper },
    { id: 'programacion', name: 'Programación', icon: Calendar },
    { id: 'anunciantes', name: 'Anunciantes', icon: Users },
    { id: 'nosotros', name: 'Nosotros', icon: Settings },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [noticias, programacion, anunciantes, nosotros] = await Promise.all([
        apiService.getNoticias(),
        apiService.getProgramacion(),
        apiService.getAnunciantes(),
        apiService.getNosotros()
      ]);

      setStats({
        noticias: noticias.length,
        programas: programacion.length,
        anunciantes: anunciantes.length,
        nosotros: nosotros ? 1 : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { title: 'Total Noticias', value: stats.noticias, icon: Newspaper, color: 'blue' },
    { title: 'Programas Activos', value: stats.programas, icon: Calendar, color: 'green' },
    { title: 'Anunciantes', value: stats.anunciantes, icon: Users, color: 'purple' },
    { title: 'Info Empresa', value: stats.nosotros, icon: Settings, color: 'orange' },
  ];

  return (
    <div className="dashboard-container">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="overlay show"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div className="sidebar-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo-icon">
              <BarChart3 className="icon" />
            </div>
            <div className="logo-text">
              <h1>Inicio</h1>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="menu">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('overview')}
              className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
            >
              <Home className="menu-icon" />
              <span>Inicio</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('noticias')}
              className={`menu-item ${activeSection === 'noticias' ? 'active' : ''}`}
            >
              <Newspaper className="menu-icon" />
              <span>Noticias</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('programacion')}
              className={`menu-item ${activeSection === 'programacion' ? 'active' : ''}`}
            >
              <Calendar className="menu-icon" />
              <span>Programación</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('anunciantes')}
              className={`menu-item ${activeSection === 'anunciantes' ? 'active' : ''}`}
            >
              <Users className="menu-icon" />
              <span>Anunciantes</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('nosotros')}
              className={`menu-item ${activeSection === 'nosotros' ? 'active' : ''}`}
            >
              <Settings className="menu-icon" />
              <span>Nosotros</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection('live-stream')}
              className={`menu-item ${activeSection === 'live-stream' ? 'active' : ''}`}
            >
              <Play className="menu-icon" />
              <span>Live Stream</span>
            </motion.button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-btn"
            >
              {sidebarOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>
            <div className="header-title">
              <h2>{menuItems.find(item => item.id === activeSection)?.name}</h2>
              <p>Gestiona el contenido de ZoomTV</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="header-stats">
              <span className="stat-item">
                <strong>{stats.noticias}</strong> Noticias
              </span>
              <span className="stat-item">
                <strong>{stats.programas}</strong> Programas
              </span>
              <span className="stat-item">
                <strong>{stats.anunciantes}</strong> Anunciantes
              </span>
            </div>
            <button className="action-btn">
              <Plus className="icon" />
              <span>Nuevo</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="content">
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overview"
            >
              <div className="welcome-section">
                <div className="welcome-header">
                  <h1>Sistema de Administración ZoomTV</h1>
                  <p className="welcome-subtitle">Panel de control para la gestión completa de contenido</p>
                </div>
                
                <div className="description-card">
                  <h2>¿Qué puedes hacer en este sistema?</h2>
                  <div className="features-grid">
                    <div className="feature-item">
                      <div className="feature-icon">
                        <Newspaper className="icon" />
                      </div>
                      <div className="feature-content">
                        <h3>Gestionar Noticias</h3>
                        <p>Crear, editar y administrar todas las noticias de ZoomTV. Organiza por categorías: Actualidad, Deportes, Música, Nacionales y Regionales.</p>
                      </div>
                    </div>
                    
                    <div className="feature-item">
                      <div className="feature-icon">
                        <Calendar className="icon" />
                      </div>
                      <div className="feature-content">
                        <h3>Programación TV</h3>
                        <p>Configura la programación semanal de ZoomTV. Establece horarios, programas, conductores y categorías para cada día.</p>
                      </div>
                    </div>
                    
                    <div className="feature-item">
                      <div className="feature-icon">
                        <Users className="icon" />
                      </div>
                      <div className="feature-content">
                        <h3>Anunciantes</h3>
                        <p>Administra la base de datos de anunciantes. Gestiona información de contacto, horarios, categorías y materiales promocionales.</p>
                      </div>
                    </div>
                    
                    <div className="feature-item">
                      <div className="feature-icon">
                        <Settings className="icon" />
                      </div>
                      <div className="feature-content">
                        <h3>Información de la Empresa</h3>
                        <p>Mantén actualizada la información de ZoomTV: misión, visión, valores, equipo de trabajo y datos de contacto.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="quick-stats">
                  <h3>Resumen de Contenido</h3>
                  <div className="stats-row">
                    <div className="stat-item">
                      <span className="stat-number">{stats.noticias}</span>
                      <span className="stat-label">Noticias</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.programas}</span>
                      <span className="stat-label">Programas</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.anunciantes}</span>
                      <span className="stat-label">Anunciantes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{stats.nosotros}</span>
                      <span className="stat-label">Info Empresa</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section Components */}
          {activeSection === 'noticias' && <NoticiasManager />}
          {activeSection === 'programacion' && <ProgramacionManager />}
          {activeSection === 'anunciantes' && <AnunciantesManager />}
          {activeSection === 'nosotros' && <NosotrosManager />}
          {activeSection === 'live-stream' && <LiveStreamManager />}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="overlay"
        />
      )}
    </div>
  );
};

export default Dashboard;