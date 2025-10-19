# Script de Inserción de Datos de Muestra

Este script inserta datos de muestra en la base de datos de ZoomTV, incluyendo:

- **40 noticias** (10 de cada categoría: Nacionales, Regionales, Deportes, Música)
- **10 anunciantes** con información completa

## 📋 Requisitos Previos

1. **Base de datos MySQL** configurada y ejecutándose
2. **Base de datos `zoomtv_db`** creada
3. **Tablas** creadas (ejecutar `schema.sql` primero)

## 🚀 Cómo Ejecutar

### Opción 1: Ejecución Automática (Recomendada)
```bash
cd mysql_api
node run_insert_data.js
```

### Opción 2: Ejecución Manual
```bash
cd mysql_api
node insert_sample_data.js
```

## ⚙️ Configuración

El script buscará un archivo `.env` en el directorio `mysql_api`. Si no existe, se creará automáticamente con configuración por defecto.

### Configuración de Base de Datos (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_aqui
DB_NAME=zoomtv_db
DB_PORT=3306
```

## 📊 Datos que se Insertarán

### Noticias (40 total)
- **Nacionales**: 10 noticias sobre política, economía, salud, educación
- **Regionales**: 10 noticias sobre gobiernos regionales y desarrollo local
- **Deportes**: 10 noticias sobre fútbol, vóley, atletismo, etc.
- **Música**: 10 noticias sobre conciertos, festivales, artistas

### Anunciantes (10 total)
- Restaurante El Rincón Criollo
- AutoServicio Express
- Clínica Dental Sonrisa Perfecta
- Gimnasio Fitness Total
- Farmacia Salud y Vida
- Academia de Inglés Global
- Supermercado Mega Ahorro
- Hotel Boutique Los Jardines
- Librería El Saber
- Café Artesanal La Taza

## 🔧 Solución de Problemas

### Error de Conexión a Base de Datos
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en `.env`
- Asegurar que la base de datos `zoomtv_db` existe

### Error de Dependencias
```bash
npm install mysql2 dotenv
```

### Error de Tablas
Ejecutar primero el script de creación de esquema:
```bash
mysql -u root -p zoomtv_db < database/schema.sql
```

## 📝 Notas Importantes

- El script es **idempotente** - se puede ejecutar múltiples veces
- Los datos se insertan con `activa = true` por defecto
- Las noticias destacadas se marcan automáticamente
- Todas las fechas se establecen en la fecha actual

## ✅ Verificación

Después de ejecutar el script, puedes verificar los datos:

```sql
-- Contar noticias por categoría
SELECT categoria, COUNT(*) as total FROM noticias GROUP BY categoria;

-- Contar anunciantes activos
SELECT COUNT(*) as total_anunciantes FROM anunciantes WHERE activo = true;

-- Ver noticias destacadas
SELECT titulo, categoria FROM noticias WHERE destacada = true;
```
