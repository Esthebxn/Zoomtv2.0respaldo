import axios from 'axios';

const API_BASE_URL = 'https://zoomtv2-0respaldo.onrender.com/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Servicio principal con métodos simplificados
const apiService = {
  // ===== NOSOTROS =====
  getNosotros: () => api.get('/nosotros'),
  createNosotros: (data) => api.post('/nosotros', data),
  updateNosotros: (id, data) => api.put(`/nosotros/${id}`, data),
  deleteNosotros: (id) => api.delete(`/nosotros/${id}`),

  // ===== NOTICIAS =====
  getNoticias: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.destacada !== undefined) params.append('destacada', filters.destacada);
    if (filters.activa !== undefined) params.append('activa', filters.activa);
    
    const queryString = params.toString();
    return api.get(queryString ? `/noticias?${queryString}` : '/noticias');
  },
  createNoticia: (data) => api.post('/noticias', data),
  updateNoticia: (id, data) => api.put(`/noticias/${id}`, data),
  deleteNoticia: (id) => api.delete(`/noticias/${id}`),

  // ===== PROGRAMACIÓN =====
  getProgramacion: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.dia_semana) params.append('dia_semana', filters.dia_semana);
    if (filters.categoria) params.append('categoria', filters.categoria);
    if (filters.activo !== undefined) params.append('activo', filters.activo);
    
    const queryString = params.toString();
    return api.get(queryString ? `/programacion?${queryString}` : '/programacion');
  },
  createProgramacion: (data) => api.post('/programacion', data),
  updateProgramacion: (id, data) => api.put(`/programacion/${id}`, data),
  deleteProgramacion: (id) => api.delete(`/programacion/${id}`),

  // ===== ANUNCIANTES =====
  getAnunciantes: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.activo !== undefined) params.append('activo', filters.activo);
    
    const queryString = params.toString();
    return api.get(queryString ? `/anunciantes?${queryString}` : '/anunciantes');
  },
  createAnunciante: (data) => api.post('/anunciantes', data),
  updateAnunciante: (id, data) => api.put(`/anunciantes/${id}`, data),
  deleteAnunciante: (id) => api.delete(`/anunciantes/${id}`),

  // ===== LIVE STREAM =====
  getLiveStream: () => api.get('/live-stream'),
  getAllLiveStreams: () => api.get('/live-stream/all'),
  getLiveStreamById: (id) => api.get(`/live-stream/${id}`),
  createLiveStream: (data) => api.post('/live-stream', data),
  updateLiveStream: (id, data) => api.put(`/live-stream/${id}`, data),
  deleteLiveStream: (id) => api.delete(`/live-stream/${id}`),
  activateLiveStream: (id) => api.patch(`/live-stream/${id}/activate`),
  deactivateLiveStream: (id) => api.patch(`/live-stream/${id}/deactivate`),
};

export default apiService;