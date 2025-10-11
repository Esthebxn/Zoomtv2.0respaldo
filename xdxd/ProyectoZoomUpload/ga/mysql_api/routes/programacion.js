const express = require('express');
const router = express.Router();

// GET - Obtener toda la programación
router.get('/', (req, res) => {
  const { dia_semana, categoria, activo } = req.query;
  let query = 'SELECT * FROM programacion';
  let conditions = [];
  let values = [];
  
  if (dia_semana) {
    conditions.push('dia_semana = ?');
    values.push(dia_semana);
  }
  
  if (categoria) {
    conditions.push('categoria = ?');
    values.push(categoria);
  }
  
  if (activo !== undefined) {
    conditions.push('activo = ?');
    values.push(activo === 'true');
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  query += ' ORDER BY dia_semana, horario_inicio';
  
  global.db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al obtener programación:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// GET - Obtener programación por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM programacion WHERE id = ?';
  
  global.db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener programación por ID:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró el programa' });
    }
    
    res.json(results[0]);
  });
});

// GET - Obtener programación por día
router.get('/dia/:dia', (req, res) => {
  const { dia } = req.params;
  const query = 'SELECT * FROM programacion WHERE dia_semana = ? AND activo = true ORDER BY horario_inicio';
  
  global.db.query(query, [dia], (err, results) => {
    if (err) {
      console.error('Error al obtener programación por día:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// GET - Obtener programación de la semana
router.get('/semana/actual', (req, res) => {
  const query = `SELECT * FROM programacion 
    WHERE activo = true 
    ORDER BY 
      CASE dia_semana 
        WHEN 'Lunes' THEN 1
        WHEN 'Martes' THEN 2
        WHEN 'Miércoles' THEN 3
        WHEN 'Jueves' THEN 4
        WHEN 'Viernes' THEN 5
        WHEN 'Sábado' THEN 6
        WHEN 'Domingo' THEN 7
      END, 
      horario_inicio`;
  
  global.db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener programación de la semana:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.json(results);
  });
});

// POST - Crear nuevo programa
router.post('/', (req, res) => {
  const { 
    nombre_programa, 
    descripcion, 
    horario_inicio, 
    horario_fin, 
    dia_semana, 
    conductor, 
    categoria, 
    activo,
    hora,
    programa
  } = req.body;
  
  if (!nombre_programa || !horario_inicio || !horario_fin || !dia_semana) {
    return res.status(400).json({ 
      error: 'El nombre del programa, horario de inicio, horario de fin y día de la semana son requeridos' 
    });
  }
  
  const query = `INSERT INTO programacion 
    (nombre_programa, descripcion, horario_inicio, horario_fin, dia_semana, conductor, categoria, activo, hora, programa) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [
    nombre_programa, 
    descripcion, 
    horario_inicio, 
    horario_fin, 
    dia_semana, 
    conductor, 
    categoria, 
    activo !== false,
    hora,
    programa
  ];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear programa:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.status(201).json({ 
      message: 'Programa creado exitosamente',
      id: result.insertId 
    });
  });
});

// PUT - Actualizar programa
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    nombre_programa, 
    descripcion, 
    horario_inicio, 
    horario_fin, 
    dia_semana, 
    conductor, 
    categoria, 
    activo,
    hora,
    programa
  } = req.body;
  
  if (!nombre_programa || !horario_inicio || !horario_fin || !dia_semana) {
    return res.status(400).json({ 
      error: 'El nombre del programa, horario de inicio, horario de fin y día de la semana son requeridos' 
    });
  }
  
  const query = `UPDATE programacion SET 
    nombre_programa = ?, descripcion = ?, horario_inicio = ?, horario_fin = ?, 
    dia_semana = ?, conductor = ?, categoria = ?, activo = ?, 
    hora = ?, programa = ? 
    WHERE id = ?`;
  
  const values = [
    nombre_programa, 
    descripcion, 
    horario_inicio, 
    horario_fin, 
    dia_semana, 
    conductor, 
    categoria, 
    activo,
    hora,
    programa,
    id
  ];
  
  global.db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar programa:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el programa para actualizar' });
    }
    
    res.json({ message: 'Programa actualizado exitosamente' });
  });
});

// DELETE - Eliminar programa
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM programacion WHERE id = ?';
  
  global.db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar programa:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No se encontró el programa para eliminar' });
    }
    
    res.json({ message: 'Programa eliminado exitosamente' });
  });
});

module.exports = router;
