const { spawn } = require('child_process');
const path = require('path');

// Obtener el puerto de la variable de entorno o usar el por defecto
const port = process.env.PORT || 3002;

console.log(`🚀 Iniciando TV en puerto ${port}`);

// Ejecutar vite preview con el puerto correcto
const vite = spawn('npx', ['vite', 'preview', '--port', port, '--host', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

vite.on('error', (err) => {
  console.error('Error al iniciar Vite:', err);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite terminó con código ${code}`);
  process.exit(code);
});
