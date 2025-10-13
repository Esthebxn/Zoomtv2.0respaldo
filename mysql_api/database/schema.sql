-- Crear base de datos
CREATE DATABASE IF NOT EXISTS zoomtv_db;
USE zoomtv_db;

-- Tabla para la sección Nosotros
CREATE TABLE IF NOT EXISTS nosotros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    mision TEXT,
    vision TEXT,
    valores TEXT,
    imagen_url VARCHAR(500),
    -- Campos adicionales del frontend
    nombre_empresa VARCHAR(255),
    slogan VARCHAR(500),
    email VARCHAR(100),
    telefono VARCHAR(20),
    historia TEXT,
    equipo TEXT, -- JSON con información del equipo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para Noticias
CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    resumen TEXT,
    categoria VARCHAR(100),
    autor VARCHAR(100),
    imagen_url VARCHAR(500),
    fecha_publicacion DATETIME,
    destacada BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    -- Campos adicionales del frontend
    descripcion TEXT, -- Para el resumen corto que se muestra en las tarjetas
    imagen VARCHAR(500), -- Nombre del archivo de imagen
    fecha VARCHAR(50), -- Fecha formateada para mostrar
    fuente VARCHAR(100), -- Fuente de la noticia
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para Programación
CREATE TABLE IF NOT EXISTS programacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_programa VARCHAR(255) NOT NULL,
    descripcion TEXT,
    horario_inicio TIME NOT NULL,
    horario_fin TIME NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    conductor VARCHAR(100),
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    -- Campos adicionales del frontend
    hora VARCHAR(20), -- Hora formateada para mostrar (ej: "06:00 AM")
    programa VARCHAR(255), -- Nombre del programa (igual que nombre_programa pero para consistencia)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para Anunciantes
CREATE TABLE IF NOT EXISTS anunciantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_empresa VARCHAR(255) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    descripcion TEXT,
    logo_url VARCHAR(500),
    sitio_web VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    -- Campos adicionales del frontend
    nombre VARCHAR(255), -- Nombre del anunciante (igual que nombre_empresa)
    categoria VARCHAR(100), -- Categoría del negocio
    horario VARCHAR(100), -- Horario de atención
    imagen VARCHAR(500), -- Imagen principal del anunciante
    flyer VARCHAR(500), -- Imagen del flyer promocional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para Live Stream
CREATE TABLE IF NOT EXISTS live_stream (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    url_stream VARCHAR(500) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo para Nosotros
INSERT INTO nosotros (titulo, descripcion, mision, vision, valores, nombre_empresa, slogan, email, telefono, historia) VALUES 
('ZoomTV', 'Somos una televisora local comprometida con la comunidad', 
'Informar, entretener y educar a nuestra audiencia con contenido de calidad', 
'Ser la televisora líder en nuestra región', 
'Transparencia, compromiso, innovación y servicio a la comunidad',
'Zoom TV Canal 10',
'Información veraz, entretenimiento de calidad',
'contacto@zoomtvcanal10.com',
'+51 999 888 777',
'Zoom TV Canal 10 nació en 2005 con la misión de llevar información veraz y entretenimiento de calidad a nuestros televidentes. Hoy contamos con más de 50 profesionales dedicados a la producción de contenido audiovisual de alta calidad.');

-- Insertar datos de ejemplo para Noticias
INSERT INTO noticias (titulo, contenido, resumen, categoria, autor, destacada, descripcion, imagen, fecha, fuente) VALUES 
('🚧 Intervendrán 27 puntos críticos de la Carretera Central desde este lunes', 
'El Ministerio de Transportes y Comunicaciones (MTC) informó que se intervendrán 27 puntos críticos en la Carretera Central para garantizar la seguridad vial durante la temporada de lluvias. Estas labores incluirán la estabilización de taludes, limpieza de derrumbes y mejoramiento de la capa asfáltica. La primera etapa abarcará desde Huachipa hasta Matucana, con la participación del Ejército Peruano y Provías Nacional.',
'El Ministerio de Transportes y Comunicaciones (MTC) informó que se intervendrán 27 puntos críticos en la Carretera Central para garantizar la seguridad vial durante la temporada de lluvias.',
'Nacionales', 'Redacción ZoomTV', TRUE, 
'El Ministerio de Transportes y Comunicaciones (MTC) informó que se intervendrán 27 puntos críticos en la Carretera Central para garantizar la seguridad vial durante la temporada de lluvias. Estas labores incluirán la estabilización de taludes, limpieza de derrumbes y mejoramiento de la capa asfáltica.',
'carretera_central.jpg', '03 octubre 2025', 'Andina.pe'),
('⚽ Perú derrota 2-0 a Ecuador en amistoso internacional', 
'Perú venció a Ecuador 2-0 en un amistoso jugado en Lima. Lapadula abrió el marcador al minuto 23 tras una gran jugada colectiva, mientras que Cueva cerró el encuentro con un golazo desde fuera del área. El equipo dirigido por Fossati se mostró sólido y con mayor orden táctico.',
'Perú venció a Ecuador 2-0 en un amistoso jugado en Lima. Lapadula abrió el marcador al minuto 23 tras una gran jugada colectiva.',
'Deportes', 'Reportero Deportivo', FALSE,
'Perú venció a Ecuador 2-0 en un amistoso jugado en Lima. Lapadula abrió el marcador al minuto 23 tras una gran jugada colectiva, mientras que Cueva cerró el encuentro con un golazo desde fuera del área.',
'peru_ecuador.jpg', '03 octubre 2025', 'Depor.pe');

-- Insertar datos de ejemplo para Programación
INSERT INTO programacion (nombre_programa, descripcion, horario_inicio, horario_fin, dia_semana, conductor, categoria, hora, programa) VALUES 
('Despertar Contigo', 'Programa matutino con noticias, música y entrevistas', '06:00:00', '07:00:00', 'Lunes', 'María González', 'Entretenimiento', '06:00 AM', 'Despertar Contigo'),
('Noticias del Día', 'Resumen de las noticias más importantes de la mañana', '09:00:00', '10:00:00', 'Lunes', 'Carlos López', 'Noticias', '09:00 AM', 'Noticias del Día'),
('Al Mediodía', 'Programa de variedades con cocina en vivo y música', '12:00:00', '13:00:00', 'Lunes', 'Laura Jiménez', 'Variedades', '12:00 PM', 'Al Mediodía'),
('Deportes en Acción', 'Resumen deportivo con análisis y entrevistas', '17:00:00', '18:00:00', 'Lunes', 'Roberto Sánchez', 'Deportes', '05:00 PM', 'Deportes en Acción');

-- Insertar datos de ejemplo para Anunciantes
INSERT INTO anunciantes (nombre_empresa, contacto, telefono, email, descripcion, nombre, categoria, horario, imagen, flyer) VALUES 
('Restaurante La Tradición', 'Juan Pérez', '+51 987 654 321', 'contacto@latradicion.com', 'Los mejores sabores de la cocina peruana en un ambiente acogedor y familiar. Especialistas en comida criolla y mariscos frescos.', 'Restaurante La Tradición', 'Gastronomía', 'Lun-Dom: 12:00 PM - 11:00 PM', 'restaurante_tradicion.jpg', 'flyer_restaurante.jpg'),
('AutoServicio Rápido', 'Ana Martínez', '+51 955 444 333', 'info@autoservicio.com', 'Taller mecánico especializado en mantenimiento preventivo y correctivo de vehículos. Servicio rápido y garantizado.', 'AutoServicio Rápido', 'Automotriz', 'Lun-Sáb: 8:00 AM - 6:00 PM', 'autoservicio_rapido.jpg', 'flyer_autoservicio.jpg');

-- Insertar datos de ejemplo para Live Stream
INSERT INTO live_stream (titulo, url_stream, descripcion, activo) VALUES 
('Zoom TV Live Stream', 'https://player.kick.com/elmacarius?hideHeader=true&hideChat=true', 'Transmisión en vivo de Zoom TV Canal 10', TRUE);
