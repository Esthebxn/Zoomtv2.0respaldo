const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

// Importar rutas
const nosotrosRoutes = require('./routes/nosotros');
const noticiasRoutes = require('./routes/noticias');
const programacionRoutes = require('./routes/programacion');
const anunciantesRoutes = require('./routes/anunciantes');
const liveStreamRoutes = require('./routes/live_stream');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Aumentar límite para imágenes
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zoomtv_db',
  port: 3306
};

// Crear conexión a la base de datos
const db = mysql.createConnection(dbConfig);

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Hacer la conexión disponible globalmente
global.db = db;

// Rutas
app.use('/api/nosotros', nosotrosRoutes);
app.use('/api/noticias', noticiasRoutes);
app.use('/api/programacion', programacionRoutes);
app.use('/api/anunciantes', anunciantesRoutes);
app.use('/api/live-stream', liveStreamRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de ZoomTV funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      nosotros: '/api/nosotros',
      noticias: '/api/noticias',
      programacion: '/api/programacion',
      anunciantes: '/api/anunciantes',
      liveStream: '/api/live-stream',
      upload: '/api/upload'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
