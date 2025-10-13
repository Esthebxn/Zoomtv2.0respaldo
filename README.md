# 🚀 Cómo Ejecutar los Proyectos de ZoomTV

## 📁 Estructura del Proyecto

Tu proyecto tiene 3 carpetas principales:

```
Zoomtv2.0respaldo/
├── mysql_api/          # API Backend (Node.js + MySQL)
├── mysql_cms/          # CMS Frontend (React + TypeScript)
└── src/                # Frontend Principal (React + Vite)
```

## 🔧 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **MySQL** (versión 8.0 o superior)
- **npm** o **yarn**

## 📋 Instrucciones de Ejecución
## ⚠️ Notas Importantes

1. **Primero abre xamp y ejecuta el mysql** 

### 1️⃣ **API Backend (mysql_api)**

```bash
# Navegar a la carpeta de la API
cd mysql_api

# Instalar dependencias
npm install

# Configurar la base de datos MySQL
# 1. Crear la base de datos 'zoomtv_db'
# 2. Ejecutar el archivo schema.sql para crear las tablas
mysql -u root -p < database/schema.sql

# Ejecutar el servidor
npm start
# o para desarrollo con auto-reload:
npm run dev
```

**✅ La API estará disponible en:** `http://localhost:3000`

---

### 2️⃣ **CMS Frontend (mysql_cms)**

```bash
# Navegar a la carpeta del CMS
cd mysql_cms

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

**✅ El CMS estará disponible en:** `http://localhost:5173`

---

### 3️⃣ **Frontend Principal (src/)**

```bash
# Navegar a la carpeta raíz del proyecto
cd .

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

**✅ El Frontend estará disponible en:** `http://localhost:5173`

---

## 🔄 Orden de Ejecución Recomendada

### Para desarrollo completo:

1. **Primero:** Ejecutar la API Backend
   ```bash
   cd mysql_api
   npm install
   npm start
   ```

2. **Segundo:** Ejecutar el Frontend Principal
   ```bash
   cd ..
   npm install
   npm run dev
   ```

3. **Tercero:** (Opcional) Ejecutar el CMS
   ```bash
   cd mysql_cms
   npm install
   npm run dev
   ```

## 🌐 URLs de Acceso

- **Frontend Principal:** `http://localhost:5173`
- **API Backend:** `http://localhost:3000`
- **CMS Admin:** `http://localhost:5174` (si ejecutas el CMS en puerto diferente)

## 🔧 Comandos Útiles

### Para la API:
```bash
cd mysql_api
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### Para el Frontend:
```bash
npm run dev        # Desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa de producción
```

### Para el CMS:
```bash
cd mysql_cms
npm run dev        # Desarrollo
npm run build      # Construir para producción
```




**🎉 ¡Listo! Ya tienes todo el proyecto de ZoomTV ejecutándose.**
