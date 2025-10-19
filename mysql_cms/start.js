import { spawn } from 'child_process';
import path from 'path';

// Obtener el puerto de la variable de entorno o usar el por defecto
const port = process.env.PORT || 3001;

console.log(`🚀 Iniciando CMS en puerto ${port}`);

// Primero hacer build
console.log('📦 Construyendo proyecto...');
const build = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true
});

build.on('error', (err) => {
  console.error('Error al construir:', err);
  process.exit(1);
});

build.on('close', (code) => {
  if (code !== 0) {
    console.error(`Build falló con código ${code}`);
    process.exit(code);
  }
  
  console.log('✅ Build completado, iniciando servidor...');
  
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
});
