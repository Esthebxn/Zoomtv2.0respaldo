const express = require('express');
const router = express.Router();

// GET - Obtener todas las noticias
router.get('/', (req, res) => {
  const { categoria, destacada, activa } = req.query;
  let query = 'SELECT * FROM noticias';
  let conditions = [];
  let values = [];
  
  if (categoria) {
    conditions.push('categoria = ?');
    values.push(categoria);
  }
  
  if (destacada !== undefined) {
    conditions.push('destacada = ?');
    values.push(destacada === 'true');
  }
  
  if (activa !== undefined) {
    conditions.push('activa = ?');
    values.push(activa === 'true');
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY created_at DESC';
  
  global.db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al obtener noticias:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// GET - Obtener noticia por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM noticias WHERE id = ?';
  
  global.db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener noticia por ID:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró la noticia' });
    }
    
    res.json(results[0]);
  });
});

// GET - Obtener noticias destacadas
router.get('/destacadas/list', (req, res) => {
  const query = 'SELECT * FROM noticias WHERE destacada = true AND activa = true ORDER BY created_at DESC';
  
  global.db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener noticias destacadas:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// POST - Crear nueva noticia
router.post('/', (req, res) => {
  const { 
    titulo, 
    contenido, 
    resumen, 
    categoria, 
    autor, 
    imagen_url, 
    fecha_publicacion, 
    destacada, 
    activa,
    descripcion,
    imagen,
    fecha,
    fuente
  } = req.body;
  
  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'El título y contenido son requeridos' });
  }
  
  const query = `INSERT INTO noticias 
    (titulo, contenido, resumen, categoria, autor, imagen_url, fecha_publicacion, destacada, activa, descripcion, imagen, fecha, fuente) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [
    titulo, 
    contenido, 
    resumen, 
    categoria, 
    autor, 
    imagen_url, 
    fecha_publicacion || new Date(), 
    destacada || false, 
    activa !== false,
    descripcion,
    imagen,
    fecha,
    fuente
  ];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear noticia:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.status(201).json({ 
      message: 'Noticia creada exitosamente',
      id: result.insertId 
    });
  });
});

// PUT - Actualizar noticia
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    titulo, 
    contenido, 
    resumen, 
    categoria, 
    autor, 
    imagen_url, 
    fecha_publicacion, 
    destacada, 
    activa,
    descripcion,
    imagen,
    fecha,
    fuente
  } = req.body;
  
  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'El título y contenido son requeridos' });
  }
  
  const query = `UPDATE noticias SET 
    titulo = ?, contenido = ?, resumen = ?, categoria = ?, autor = ?, 
    imagen_url = ?, fecha_publicacion = ?, destacada = ?, activa = ?, 
    descripcion = ?, imagen = ?, fecha = ?, fuente = ? 
    WHERE id = ?`;
  
  const values = [
    titulo, 
    contenido, 
    resumen, 
    categoria, 
    autor, 
    imagen_url, 
    fecha_publicacion, 
    destacada, 
    activa,
    descripcion,
    imagen,
    fecha,
    fuente,
    id
  ];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar noticia:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la noticia para actualizar' });
    }
    
    res.json({ message: 'Noticia actualizada exitosamente' });
  });
});

// DELETE - Eliminar noticia
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM noticias WHERE id = ?';
  
  global.db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar noticia:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró la noticia para eliminar' });
    }
    
    res.json({ message: 'Noticia eliminada exitosamente' });
  });
});

module.exports = router;
