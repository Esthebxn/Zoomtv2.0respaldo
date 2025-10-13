// Servicio API para conectar con el backend
const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  // Método genérico para hacer peticiones GET
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error en petición GET:', error);
      throw error;
    }
  }

  // ===== NOSOTROS =====
  async getNosotros() {
    return this.get('/nosotros');
  }

  async getAllNosotros() {
    return this.get('/nosotros/all');
  }

  async getNosotrosById(id) {
    return this.get(`/nosotros/${id}`);
  }

  // ===== NOTICIAS =====
  async getNoticias(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.categoria) queryParams.append('categoria', filters.categoria);
    if (filters.destacada !== undefined) queryParams.append('destacada', filters.destacada);
    if (filters.activa !== undefined) queryParams.append('activa', filters.activa);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/noticias?${queryString}` : '/noticias';
    
    return this.get(endpoint);
  }

  async getNoticiaById(id) {
    return this.get(`/noticias/${id}`);
  }

  async getNoticiasDestacadas() {
    return this.get('/noticias/destacadas/list');
  }

  // ===== PROGRAMACIÓN =====
  async getProgramacion(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.dia_semana) queryParams.append('dia_semana', filters.dia_semana);
    if (filters.categoria) queryParams.append('categoria', filters.categoria);
    if (filters.activo !== undefined) queryParams.append('activo', filters.activo);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/programacion?${queryString}` : '/programacion';
    
    return this.get(endpoint);
  }

  async getProgramaById(id) {
    return this.get(`/programacion/${id}`);
  }

  async getProgramacionByDia(dia) {
    return this.get(`/programacion/dia/${dia}`);
  }

  async getProgramacionSemana() {
    return this.get('/programacion/semana/actual');
  }

  // ===== ANUNCIANTES =====
  async getAnunciantes(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.activo !== undefined) queryParams.append('activo', filters.activo);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/anunciantes?${queryString}` : '/anunciantes';
    
    return this.get(endpoint);
  }

  async getAnuncianteById(id) {
    return this.get(`/anunciantes/${id}`);
  }

  async getAnunciantesActivos() {
    return this.get('/anunciantes/activos/list');
  }

  // ===== LIVE STREAM =====
  async getLiveStream() {
    return this.get('/live-stream');
  }

  async getAllLiveStreams() {
    return this.get('/live-stream/all');
  }

  async getLiveStreamById(id) {
    return this.get(`/live-stream/${id}`);
  }
}

// Crear instancia del servicio
const apiService = new ApiService();

export default apiService;
