const express = require('express');
const router = express.Router();

// GET - Obtener información de nosotros
router.get('/', (req, res) => {
  const query = 'SELECT * FROM nosotros ORDER BY id DESC LIMIT 1';
  
  global.db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener datos de nosotros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró información de nosotros' });
    }
    
    res.json(results[0]);
  });
});

// GET - Obtener todos los registros de nosotros
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM nosotros ORDER BY created_at DESC';
  
  global.db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener todos los datos de nosotros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// GET - Obtener nosotros por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM nosotros WHERE id = ?';
  
  global.db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener nosotros por ID:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró el registro' });
    }
    
    res.json(results[0]);
  });
});

// POST - Crear nuevo registro de nosotros
router.post('/', (req, res) => {
  const { 
    titulo, 
    descripcion, 
    mision, 
    vision, 
    valores, 
    imagen_url,
    nombre_empresa,
    slogan,
    email,
    telefono,
    historia,
    equipo
  } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ error: 'El título es requerido' });
  }
  
  const query = `INSERT INTO nosotros 
    (titulo, descripcion, mision, vision, valores, imagen_url, nombre_empresa, slogan, email, telefono, historia, equipo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [titulo, descripcion, mision, vision, valores, imagen_url, nombre_empresa, slogan, email, telefono, historia, equipo];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear registro de nosotros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.status(201).json({ 
      message: 'Registro creado exitosamente',
      id: result.insertId 
    });
  });
});

// PUT - Actualizar registro de nosotros
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    titulo, 
    descripcion, 
    mision, 
    vision, 
    valores, 
    imagen_url,
    nombre_empresa,
    slogan,
    email,
    telefono,
    historia,
    equipo
  } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ error: 'El título es requerido' });
  }
  
  const query = `UPDATE nosotros SET 
    titulo = ?, descripcion = ?, mision = ?, vision = ?, valores = ?, imagen_url = ?, 
    nombre_empresa = ?, slogan = ?, email = ?, telefono = ?, historia = ?, equipo = ? 
    WHERE id = ?`;
  const values = [titulo, descripcion, mision, vision, valores, imagen_url, nombre_empresa, slogan, email, telefono, historia, equipo, id];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar registro de nosotros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el registro para actualizar' });
    }
    
    res.json({ message: 'Registro actualizado exitosamente' });
  });
});

// DELETE - Eliminar registro de nosotros
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM nosotros WHERE id = ?';
  
  global.db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar registro de nosotros:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el registro para eliminar' });
    }
    
    res.json({ message: 'Registro eliminado exitosamente' });
  });
});

module.exports = router;
