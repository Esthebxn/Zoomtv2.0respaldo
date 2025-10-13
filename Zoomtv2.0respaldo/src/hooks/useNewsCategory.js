import { useState, useEffect } from 'react';
import { newsApi } from '../services/api';

export const useNewsCategory = (category) => {
  const [noticias, setNoticias] = useState([]);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Cargar noticias desde la API
  const cargarNoticias = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await newsApi.getAll({
        page,
        limit: 10,
        category,
        status: 'published'
      });

      if (response.success) {
        setNoticias(response.data);
        setPagination(response.pagination);
      } else {
        setError('Error al cargar las noticias');
      }
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setError('No se pudieron cargar las noticias. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar noticia individual
  const cargarNoticiaCompleta = async (id) => {
    try {
      const response = await newsApi.getById(id);
      if (response.success) {
        setNoticiaSeleccionada(response.data);
      } else {
        setError('No se pudo cargar la noticia completa');
      }
    } catch (err) {
      console.error('Error cargando noticia:', err);
      setError('Error al cargar la noticia completa');
    }
  };

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fechaString;
    }
  };

  // Cargar noticias al montar el componente
  useEffect(() => {
    cargarNoticias();
  }, [category, cargarNoticias]);

  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= pagination.pages) {
      cargarNoticias(nuevaPagina);
    }
  };

  // Manejar clic en noticia
  const handleNoticiaClick = (noticia) => {
    if (noticia._id) {
      cargarNoticiaCompleta(noticia._id);
    } else {
      setNoticiaSeleccionada(noticia);
    }
  };

  return {
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
  };
};
