const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos - Google Cloud MySQL (misma que server.js)
const dbConfig = {
  host: '34.63.133.132', // IP pública de tu instancia MySQL en Google Cloud
  user: 'Pato',
  password: 'Zamora_2004',
  database: 'zoomtv_db', // Usando la base de datos zoomtv_db que ya existe
  port: 3306,
  ssl: {
    rejectUnauthorized: false // SSL requerido por Google Cloud
  },
  connectTimeout: 30000, // Timeout de conexión de 30 segundos
  multipleStatements: true, // Permitir múltiples statements
  charset: 'utf8mb4' // Charset por defecto
};

// Datos de noticias por categoría
const noticiasData = {
  'Nacionales': [
    {
      titulo: 'Gobierno anuncia nuevo plan de reactivación económica',
      contenido: 'El gobierno peruano presentó un ambicioso plan de reactivación económica que incluye inversiones por más de 5 mil millones de soles en infraestructura, educación y salud. El plan contempla la creación de 100,000 nuevos empleos y el fortalecimiento de las pequeñas y medianas empresas.',
      resumen: 'El gobierno peruano presentó un ambicioso plan de reactivación económica que incluye inversiones por más de 5 mil millones de soles.',
      autor: 'Redacción ZoomTV',
      destacada: true,
      descripcion: 'El gobierno peruano presentó un ambicioso plan de reactivación económica que incluye inversiones por más de 5 mil millones de soles en infraestructura, educación y salud.',
      imagen: 'reactivacion_economica.jpg',
      fecha: '04 octubre 2025',
      fuente: 'El Peruano'
    },
    {
      titulo: 'Minsa reporta disminución del 15% en casos de dengue',
      contenido: 'El Ministerio de Salud reportó una disminución del 15% en los casos de dengue a nivel nacional durante las últimas cuatro semanas. Las autoridades atribuyen esta mejora a las campañas de prevención y fumigación implementadas en las zonas de mayor riesgo.',
      resumen: 'El Ministerio de Salud reportó una disminución del 15% en los casos de dengue a nivel nacional durante las últimas cuatro semanas.',
      autor: 'Equipo de Salud',
      destacada: false,
      descripcion: 'El Ministerio de Salud reportó una disminución del 15% en los casos de dengue a nivel nacional durante las últimas cuatro semanas.',
      imagen: 'salud_dengue.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Minsa'
    },
    {
      titulo: 'Poder Judicial implementa nuevo sistema de justicia digital',
      contenido: 'El Poder Judicial implementó un nuevo sistema de justicia digital que permitirá a los ciudadanos realizar trámites judiciales de forma virtual. El sistema incluye videoconferencias para audiencias, presentación digital de documentos y seguimiento en tiempo real de los procesos.',
      resumen: 'El Poder Judicial implementó un nuevo sistema de justicia digital que permitirá a los ciudadanos realizar trámites judiciales de forma virtual.',
      autor: 'Corresponsal Judicial',
      destacada: false,
      descripcion: 'El Poder Judicial implementó un nuevo sistema de justicia digital que permitirá a los ciudadanos realizar trámites judiciales de forma virtual.',
      imagen: 'justicia_digital.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Poder Judicial'
    },
    {
      titulo: 'Minedu anuncia construcción de 50 nuevas escuelas rurales',
      contenido: 'El Ministerio de Educación anunció la construcción de 50 nuevas escuelas rurales en las regiones más alejadas del país. Cada escuela contará con aulas modernas, laboratorios de cómputo y bibliotecas digitales para mejorar la calidad educativa en zonas rurales.',
      resumen: 'El Ministerio de Educación anunció la construcción de 50 nuevas escuelas rurales en las regiones más alejadas del país.',
      autor: 'Equipo Educativo',
      destacada: true,
      descripcion: 'El Ministerio de Educación anunció la construcción de 50 nuevas escuelas rurales en las regiones más alejadas del país.',
      imagen: 'escuelas_rurales.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Minedu'
    },
    {
      titulo: 'SENASA intensifica controles sanitarios en mercados',
      contenido: 'El Servicio Nacional de Sanidad Agraria (SENASA) intensificó los controles sanitarios en los principales mercados del país para garantizar la inocuidad de los alimentos. Se han implementado nuevos protocolos de inspección y capacitación para los comerciantes.',
      resumen: 'El Servicio Nacional de Sanidad Agraria (SENASA) intensificó los controles sanitarios en los principales mercados del país.',
      autor: 'Reportero Agropecuario',
      destacada: false,
      descripcion: 'El Servicio Nacional de Sanidad Agraria (SENASA) intensificó los controles sanitarios en los principales mercados del país.',
      imagen: 'senasa_controles.jpg',
      fecha: '04 octubre 2025',
      fuente: 'SENASA'
    },
    {
      titulo: 'Indecopi sanciona a empresas por publicidad engañosa',
      contenido: 'El Instituto Nacional de Defensa de la Competencia y de la Protección de la Propiedad Intelectual (Indecopi) sancionó a 15 empresas por publicidad engañosa en productos de consumo masivo. Las multas ascienden a más de 2 millones de soles.',
      resumen: 'El Indecopi sancionó a 15 empresas por publicidad engañosa en productos de consumo masivo con multas de más de 2 millones de soles.',
      autor: 'Corresponsal Económico',
      destacada: false,
      descripcion: 'El Instituto Nacional de Defensa de la Competencia y de la Protección de la Propiedad Intelectual (Indecopi) sancionó a 15 empresas por publicidad engañosa.',
      imagen: 'indecopi_sanciones.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Indecopi'
    },
    {
      titulo: 'SUNAT implementa nuevo sistema de facturación electrónica',
      contenido: 'La Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT) implementó un nuevo sistema de facturación electrónica que simplificará los procesos tributarios para las empresas. El sistema incluye nuevas funcionalidades de reporte automático.',
      resumen: 'La SUNAT implementó un nuevo sistema de facturación electrónica que simplificará los procesos tributarios para las empresas.',
      autor: 'Especialista Tributario',
      destacada: false,
      descripcion: 'La Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT) implementó un nuevo sistema de facturación electrónica.',
      imagen: 'sunat_facturacion.jpg',
      fecha: '04 octubre 2025',
      fuente: 'SUNAT'
    },
    {
      titulo: 'MTC inicia obras de modernización del aeropuerto Jorge Chávez',
      contenido: 'El Ministerio de Transportes y Comunicaciones inició las obras de modernización del aeropuerto Jorge Chávez con una inversión de 1,500 millones de dólares. El proyecto incluye la ampliación de terminales, nuevas pistas de aterrizaje y sistemas de seguridad de última generación.',
      resumen: 'El MTC inició las obras de modernización del aeropuerto Jorge Chávez con una inversión de 1,500 millones de dólares.',
      autor: 'Reportero de Infraestructura',
      destacada: true,
      descripcion: 'El Ministerio de Transportes y Comunicaciones inició las obras de modernización del aeropuerto Jorge Chávez.',
      imagen: 'aeropuerto_modernizacion.jpg',
      fecha: '04 octubre 2025',
      fuente: 'MTC'
    },
    {
      titulo: 'Defensoría del Pueblo presenta informe sobre derechos humanos',
      contenido: 'La Defensoría del Pueblo presentó su informe anual sobre la situación de los derechos humanos en el Perú. El documento destaca avances en educación y salud, pero señala desafíos pendientes en materia de seguridad ciudadana y acceso a la justicia.',
      resumen: 'La Defensoría del Pueblo presentó su informe anual sobre la situación de los derechos humanos en el Perú.',
      autor: 'Corresponsal de Derechos Humanos',
      destacada: false,
      descripcion: 'La Defensoría del Pueblo presentó su informe anual sobre la situación de los derechos humanos en el Perú.',
      imagen: 'defensoria_informe.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Defensoría del Pueblo'
    },
    {
      titulo: 'INEI reporta crecimiento del PBI del 3.2% en el tercer trimestre',
      contenido: 'El Instituto Nacional de Estadística e Informática (INEI) reportó un crecimiento del Producto Bruto Interno (PBI) del 3.2% en el tercer trimestre del año. Los sectores que más contribuyeron al crecimiento fueron construcción, comercio y servicios.',
      resumen: 'El INEI reportó un crecimiento del PBI del 3.2% en el tercer trimestre del año.',
      autor: 'Analista Económico',
      destacada: true,
      descripcion: 'El Instituto Nacional de Estadística e Informática (INEI) reportó un crecimiento del Producto Bruto Interno (PBI) del 3.2%.',
      imagen: 'inei_pbi.jpg',
      fecha: '04 octubre 2025',
      fuente: 'INEI'
    }
  ],
  'Regionales': [
    {
      titulo: 'Gobierno Regional de Lima inaugura nuevo hospital en Huaral',
      contenido: 'El Gobierno Regional de Lima inauguró un nuevo hospital de 200 camas en Huaral que beneficiará a más de 150,000 habitantes de la zona norte de Lima. El hospital cuenta con equipos de última generación y especialidades médicas completas.',
      resumen: 'El Gobierno Regional de Lima inauguró un nuevo hospital de 200 camas en Huaral que beneficiará a más de 150,000 habitantes.',
      autor: 'Corresponsal Regional',
      destacada: true,
      descripcion: 'El Gobierno Regional de Lima inauguró un nuevo hospital de 200 camas en Huaral que beneficiará a más de 150,000 habitantes.',
      imagen: 'hospital_huaral.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Lima'
    },
    {
      titulo: 'Cusco implementa programa de turismo sostenible',
      contenido: 'La región Cusco implementó un programa de turismo sostenible que incluye la capacitación de 500 guías turísticos en conservación ambiental y turismo responsable. El programa busca proteger los sitios arqueológicos y promover el turismo comunitario.',
      resumen: 'La región Cusco implementó un programa de turismo sostenible que incluye la capacitación de 500 guías turísticos.',
      autor: 'Reportero de Turismo',
      destacada: false,
      descripcion: 'La región Cusco implementó un programa de turismo sostenible que incluye la capacitación de 500 guías turísticos.',
      imagen: 'turismo_cusco.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Cusco'
    },
    {
      titulo: 'Arequipa construye nuevo puente sobre el río Chili',
      contenido: 'La Municipalidad Provincial de Arequipa inició la construcción de un nuevo puente vehicular sobre el río Chili que conectará los distritos de Cayma y Yanahuara. La obra tendrá una inversión de 25 millones de soles y se completará en 18 meses.',
      resumen: 'La Municipalidad Provincial de Arequipa inició la construcción de un nuevo puente vehicular sobre el río Chili.',
      autor: 'Corresponsal de Obras',
      destacada: false,
      descripcion: 'La Municipalidad Provincial de Arequipa inició la construcción de un nuevo puente vehicular sobre el río Chili.',
      imagen: 'puente_arequipa.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Municipalidad de Arequipa'
    },
    {
      titulo: 'Piura implementa sistema de alerta temprana para El Niño',
      contenido: 'La región Piura implementó un sistema de alerta temprana para fenómenos de El Niño que incluye 50 estaciones meteorológicas y un centro de monitoreo 24/7. El sistema permitirá alertar a la población con 48 horas de anticipación.',
      resumen: 'La región Piura implementó un sistema de alerta temprana para fenómenos de El Niño con 50 estaciones meteorológicas.',
      autor: 'Especialista en Clima',
      destacada: true,
      descripcion: 'La región Piura implementó un sistema de alerta temprana para fenómenos de El Niño que incluye 50 estaciones meteorológicas.',
      imagen: 'alerta_piura.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Piura'
    },
    {
      titulo: 'Lambayeque promueve exportación de productos orgánicos',
      contenido: 'La región Lambayeque promovió la exportación de productos orgánicos a mercados europeos y asiáticos. Se han certificado 200 hectáreas de cultivos orgánicos y se espera exportar más de 500 toneladas de productos al año.',
      resumen: 'La región Lambayeque promovió la exportación de productos orgánicos a mercados europeos y asiáticos.',
      autor: 'Reportero Agropecuario',
      destacada: false,
      descripcion: 'La región Lambayeque promovió la exportación de productos orgánicos a mercados europeos y asiáticos.',
      imagen: 'organicos_lambayeque.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Lambayeque'
    },
    {
      titulo: 'La Libertad inaugura centro de innovación tecnológica',
      contenido: 'La región La Libertad inauguró un centro de innovación tecnológica en Trujillo que albergará a 50 startups y empresas tecnológicas. El centro cuenta con laboratorios de desarrollo, espacios de coworking y programas de aceleración empresarial.',
      resumen: 'La región La Libertad inauguró un centro de innovación tecnológica en Trujillo que albergará a 50 startups.',
      autor: 'Corresponsal Tecnológico',
      destacada: false,
      descripcion: 'La región La Libertad inauguró un centro de innovación tecnológica en Trujillo que albergará a 50 startups.',
      imagen: 'innovacion_libertad.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de La Libertad'
    },
    {
      titulo: 'Cajamarca implementa programa de reforestación',
      contenido: 'La región Cajamarca implementó un programa de reforestación que plantará 1 millón de árboles nativos en zonas degradadas. El programa incluye la participación de comunidades campesinas y la creación de viveros forestales.',
      resumen: 'La región Cajamarca implementó un programa de reforestación que plantará 1 millón de árboles nativos.',
      autor: 'Reportero Ambiental',
      destacada: false,
      descripcion: 'La región Cajamarca implementó un programa de reforestación que plantará 1 millón de árboles nativos.',
      imagen: 'reforestacion_cajamarca.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Cajamarca'
    },
    {
      titulo: 'Junín construye carretera de integración regional',
      contenido: 'La región Junín inició la construcción de una carretera de integración regional que conectará Huancayo con Satipo. La obra tendrá una longitud de 120 kilómetros y una inversión de 200 millones de soles.',
      resumen: 'La región Junín inició la construcción de una carretera de integración regional que conectará Huancayo con Satipo.',
      autor: 'Corresponsal de Infraestructura',
      destacada: true,
      descripcion: 'La región Junín inició la construcción de una carretera de integración regional que conectará Huancayo con Satipo.',
      imagen: 'carretera_junin.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Junín'
    },
    {
      titulo: 'San Martín promueve turismo de naturaleza',
      contenido: 'La región San Martín promovió el turismo de naturaleza con la inauguración de 10 nuevos circuitos ecoturísticos. Los circuitos incluyen observación de aves, caminatas por la selva y visitas a comunidades nativas.',
      resumen: 'La región San Martín promovió el turismo de naturaleza con la inauguración de 10 nuevos circuitos ecoturísticos.',
      autor: 'Reportero de Turismo',
      destacada: false,
      descripcion: 'La región San Martín promovió el turismo de naturaleza con la inauguración de 10 nuevos circuitos ecoturísticos.',
      imagen: 'turismo_san_martin.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de San Martín'
    },
    {
      titulo: 'Loreto implementa programa de conservación de bosques',
      contenido: 'La región Loreto implementó un programa de conservación de bosques que protegerá 500,000 hectáreas de selva amazónica. El programa incluye la participación de comunidades indígenas y la creación de corredores biológicos.',
      resumen: 'La región Loreto implementó un programa de conservación de bosques que protegerá 500,000 hectáreas de selva amazónica.',
      autor: 'Reportero Ambiental',
      destacada: true,
      descripcion: 'La región Loreto implementó un programa de conservación de bosques que protegerá 500,000 hectáreas de selva amazónica.',
      imagen: 'conservacion_loreto.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Gobierno Regional de Loreto'
    }
  ],
  'Deportes': [
    {
      titulo: 'Universitario de Deportes clasifica a la final de la Copa Libertadores',
      contenido: 'Universitario de Deportes logró clasificar a la final de la Copa Libertadores tras vencer 2-1 al Flamengo en el Monumental. Los goles fueron anotados por Valera y Rivera, mientras que el equipo brasileño descontó en el minuto 85. La final se jugará el próximo domingo en el Maracaná.',
      resumen: 'Universitario de Deportes logró clasificar a la final de la Copa Libertadores tras vencer 2-1 al Flamengo.',
      autor: 'Reportero Deportivo',
      destacada: true,
      descripcion: 'Universitario de Deportes logró clasificar a la final de la Copa Libertadores tras vencer 2-1 al Flamengo en el Monumental.',
      imagen: 'universitario_libertadores.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Fútbol Peruano'
    },
    {
      titulo: 'Selección peruana de vóley femenino gana medalla de oro en Panamericanos',
      contenido: 'La selección peruana de vóley femenino ganó la medalla de oro en los Juegos Panamericanos tras vencer 3-1 a Brasil en la final. El equipo dirigido por Natalia Málaga mostró un gran nivel y se consagró campeón panamericano por tercera vez en su historia.',
      resumen: 'La selección peruana de vóley femenino ganó la medalla de oro en los Juegos Panamericanos tras vencer 3-1 a Brasil.',
      autor: 'Reportero de Vóley',
      destacada: true,
      descripcion: 'La selección peruana de vóley femenino ganó la medalla de oro en los Juegos Panamericanos tras vencer 3-1 a Brasil.',
      imagen: 'volei_panamericanos.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Vóley'
    },
    {
      titulo: 'Alianza Lima presenta nuevo refuerzo brasileño',
      contenido: 'Alianza Lima presentó oficialmente a su nuevo refuerzo brasileño, el delantero João Silva, quien llegó procedente del Palmeiras. El jugador de 28 años firmó un contrato por dos temporadas y se mostró emocionado por vestir la camiseta íntima.',
      resumen: 'Alianza Lima presentó oficialmente a su nuevo refuerzo brasileño, el delantero João Silva, quien llegó procedente del Palmeiras.',
      autor: 'Corresponsal de Alianza',
      destacada: false,
      descripcion: 'Alianza Lima presentó oficialmente a su nuevo refuerzo brasileño, el delantero João Silva, quien llegó procedente del Palmeiras.',
      imagen: 'alianza_refuerzo.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Alianza Lima'
    },
    {
      titulo: 'Perú gana medalla de plata en levantamiento de pesas',
      contenido: 'El levantador de pesas peruano Carlos Andrade ganó la medalla de plata en la categoría de 77 kg en el Campeonato Mundial de Halterofilia. Andrade levantó 180 kg en arranque y 220 kg en envión, estableciendo un nuevo récord nacional.',
      resumen: 'El levantador de pesas peruano Carlos Andrade ganó la medalla de plata en la categoría de 77 kg en el Campeonato Mundial.',
      autor: 'Reportero de Pesas',
      destacada: false,
      descripcion: 'El levantador de pesas peruano Carlos Andrade ganó la medalla de plata en la categoría de 77 kg en el Campeonato Mundial.',
      imagen: 'pesas_medalla.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Halterofilia'
    },
    {
      titulo: 'Sporting Cristal inicia pretemporada en Brasil',
      contenido: 'Sporting Cristal inició su pretemporada en Brasil con un campamento de 15 días en la ciudad de São Paulo. El equipo celeste jugará tres partidos amistosos contra equipos brasileños y regresará a Lima el próximo lunes.',
      resumen: 'Sporting Cristal inició su pretemporada en Brasil con un campamento de 15 días en la ciudad de São Paulo.',
      autor: 'Corresponsal de Cristal',
      destacada: false,
      descripcion: 'Sporting Cristal inició su pretemporada en Brasil con un campamento de 15 días en la ciudad de São Paulo.',
      imagen: 'cristal_brasil.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Sporting Cristal'
    },
    {
      titulo: 'Selección peruana de básquet se prepara para Preolímpico',
      contenido: 'La selección peruana de básquet se prepara para el Preolímpico de las Américas que se disputará en Argentina. El equipo dirigido por Ricardo Duarte convocó a 16 jugadores, incluyendo a los bases de la NBA.',
      resumen: 'La selección peruana de básquet se prepara para el Preolímpico de las Américas que se disputará en Argentina.',
      autor: 'Reportero de Básquet',
      destacada: false,
      descripcion: 'La selección peruana de básquet se prepara para el Preolímpico de las Américas que se disputará en Argentina.',
      imagen: 'basquet_preolimpico.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Básquet'
    },
    {
      titulo: 'Maratonista peruano gana carrera de 42K en Lima',
      contenido: 'El maratonista peruano Luis Chávez ganó la carrera de 42 kilómetros en Lima con un tiempo de 2:15:30. Chávez superó a 5,000 corredores y estableció un nuevo récord en la categoría master. La carrera se disputó en el circuito del Malecón de Miraflores.',
      resumen: 'El maratonista peruano Luis Chávez ganó la carrera de 42 kilómetros en Lima con un tiempo de 2:15:30.',
      autor: 'Reportero de Atletismo',
      destacada: false,
      descripcion: 'El maratonista peruano Luis Chávez ganó la carrera de 42 kilómetros en Lima con un tiempo de 2:15:30.',
      imagen: 'maraton_lima.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Atletismo'
    },
    {
      titulo: 'FBC Melgar anuncia renovación de contrato de su técnico',
      contenido: 'FBC Melgar anunció la renovación del contrato de su técnico Néstor Lorenzo por dos temporadas más. El entrenador argentino logró clasificar al equipo arequipeño a la Copa Sudamericana y se mostró satisfecho con la continuidad.',
      resumen: 'FBC Melgar anunció la renovación del contrato de su técnico Néstor Lorenzo por dos temporadas más.',
      autor: 'Corresponsal de Melgar',
      destacada: false,
      descripcion: 'FBC Melgar anunció la renovación del contrato de su técnico Néstor Lorenzo por dos temporadas más.',
      imagen: 'melgar_tecnico.jpg',
      fecha: '04 octubre 2025',
      fuente: 'FBC Melgar'
    },
    {
      titulo: 'Perú gana medalla de bronce en natación en Panamericanos',
      contenido: 'La nadadora peruana María González ganó la medalla de bronce en los 200 metros estilo libre en los Juegos Panamericanos. González completó la prueba en 1:58:45 y se convirtió en la primera peruana en ganar una medalla en natación en Panamericanos.',
      resumen: 'La nadadora peruana María González ganó la medalla de bronce en los 200 metros estilo libre en los Juegos Panamericanos.',
      autor: 'Reportero de Natación',
      destacada: true,
      descripcion: 'La nadadora peruana María González ganó la medalla de bronce en los 200 metros estilo libre en los Juegos Panamericanos.',
      imagen: 'natacion_medalla.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Natación'
    },
    {
      titulo: 'Selección peruana de fútbol femenino se prepara para eliminatorias',
      contenido: 'La selección peruana de fútbol femenino se prepara para las eliminatorias al Mundial de 2026. El equipo dirigido por Emily Lima convocó a 23 jugadoras y realizará un microciclo de preparación en Lima antes de viajar a Colombia.',
      resumen: 'La selección peruana de fútbol femenino se prepara para las eliminatorias al Mundial de 2026.',
      autor: 'Reportero de Fútbol Femenino',
      destacada: false,
      descripcion: 'La selección peruana de fútbol femenino se prepara para las eliminatorias al Mundial de 2026.',
      imagen: 'futbol_femenino.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Federación Peruana de Fútbol'
    }
  ],
  'Música': [
    {
      titulo: 'Gian Marco presenta su nuevo álbum "Raíces"',
      contenido: 'El cantautor peruano Gian Marco presentó su nuevo álbum "Raíces" que incluye 12 canciones inéditas. El disco fusiona ritmos peruanos con sonidos contemporáneos y cuenta con la participación de artistas como Susana Baca y Eva Ayllón.',
      resumen: 'El cantautor peruano Gian Marco presentó su nuevo álbum "Raíces" que incluye 12 canciones inéditas.',
      autor: 'Reportero Musical',
      destacada: true,
      descripcion: 'El cantautor peruano Gian Marco presentó su nuevo álbum "Raíces" que incluye 12 canciones inéditas.',
      imagen: 'gian_marco_raices.jpg',
      fecha: '04 octubre 2025',
      fuente: 'ZoomTV Música'
    },
    {
      titulo: 'Festival de Rock en Lima reúne a 50,000 espectadores',
      contenido: 'El Festival de Rock en Lima reunió a 50,000 espectadores en el Estadio Nacional con la participación de bandas nacionales e internacionales. El evento contó con la presencia de grupos como Molotov, Café Tacvba y Los Prisioneros.',
      resumen: 'El Festival de Rock en Lima reunió a 50,000 espectadores en el Estadio Nacional con la participación de bandas nacionales e internacionales.',
      autor: 'Corresponsal Musical',
      destacada: false,
      descripcion: 'El Festival de Rock en Lima reunió a 50,000 espectadores en el Estadio Nacional con la participación de bandas nacionales e internacionales.',
      imagen: 'festival_rock.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Festival de Rock Lima'
    },
    {
      titulo: 'Susana Baca recibe premio internacional de música',
      contenido: 'La cantante peruana Susana Baca recibió el premio internacional de música "Lifetime Achievement" en reconocimiento a su trayectoria artística. Baca fue galardonada por su contribución a la difusión de la música afroperuana en el mundo.',
      resumen: 'La cantante peruana Susana Baca recibió el premio internacional de música "Lifetime Achievement" en reconocimiento a su trayectoria artística.',
      autor: 'Reportero Cultural',
      destacada: true,
      descripcion: 'La cantante peruana Susana Baca recibió el premio internacional de música "Lifetime Achievement" en reconocimiento a su trayectoria artística.',
      imagen: 'susana_baca_premio.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Academia de Música'
    },
    {
      titulo: 'Orquesta Sinfónica Nacional presenta temporada 2025',
      contenido: 'La Orquesta Sinfónica Nacional presentó su temporada 2025 con un repertorio que incluye obras de compositores peruanos y latinoamericanos. La temporada contará con 20 conciertos y la participación de solistas internacionales.',
      resumen: 'La Orquesta Sinfónica Nacional presentó su temporada 2025 con un repertorio que incluye obras de compositores peruanos y latinoamericanos.',
      autor: 'Corresponsal Clásico',
      destacada: false,
      descripcion: 'La Orquesta Sinfónica Nacional presentó su temporada 2025 con un repertorio que incluye obras de compositores peruanos y latinoamericanos.',
      imagen: 'sinfonica_temporada.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Orquesta Sinfónica Nacional'
    },
    {
      titulo: 'Grupo 5 celebra 25 años de trayectoria musical',
      contenido: 'El Grupo 5 celebró sus 25 años de trayectoria musical con un concierto especial en el Coliseo Amauta. El grupo cumbiambero presentó sus mayores éxitos y anunció una gira nacional que recorrerá 15 ciudades del país.',
      resumen: 'El Grupo 5 celebró sus 25 años de trayectoria musical con un concierto especial en el Coliseo Amauta.',
      autor: 'Reportero de Cumbia',
      destacada: false,
      descripcion: 'El Grupo 5 celebró sus 25 años de trayectoria musical con un concierto especial en el Coliseo Amauta.',
      imagen: 'grupo5_aniversario.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Grupo 5'
    },
    {
      titulo: 'Festival de Jazz en Lima presenta artistas internacionales',
      contenido: 'El Festival de Jazz en Lima presentó a artistas internacionales como Herbie Hancock, Chick Corea y Pat Metheny. El evento se realizó en el Teatro Municipal y contó con la participación de músicos peruanos en jam sessions.',
      resumen: 'El Festival de Jazz en Lima presentó a artistas internacionales como Herbie Hancock, Chick Corea y Pat Metheny.',
      autor: 'Corresponsal de Jazz',
      destacada: false,
      descripcion: 'El Festival de Jazz en Lima presentó a artistas internacionales como Herbie Hancock, Chick Corea y Pat Metheny.',
      imagen: 'festival_jazz.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Festival de Jazz Lima'
    },
    {
      titulo: 'Eva Ayllón lanza nuevo disco de música criolla',
      contenido: 'La cantante peruana Eva Ayllón lanzó su nuevo disco de música criolla "Perú en el Corazón" que incluye 15 temas tradicionales. El álbum fue grabado en vivo en el Teatro Municipal y cuenta con la participación de músicos de la Orquesta Sinfónica Nacional.',
      resumen: 'La cantante peruana Eva Ayllón lanzó su nuevo disco de música criolla "Perú en el Corazón" que incluye 15 temas tradicionales.',
      autor: 'Reportero de Música Criolla',
      destacada: true,
      descripcion: 'La cantante peruana Eva Ayllón lanzó su nuevo disco de música criolla "Perú en el Corazón" que incluye 15 temas tradicionales.',
      imagen: 'eva_ayllon_disco.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Eva Ayllón'
    },
    {
      titulo: 'Festival de Música Andina se realiza en Cusco',
      contenido: 'El Festival de Música Andina se realizó en Cusco con la participación de 50 grupos musicales de diferentes países. El evento incluyó talleres de instrumentos andinos y presentaciones en sitios arqueológicos como Machu Picchu y Ollantaytambo.',
      resumen: 'El Festival de Música Andina se realizó en Cusco con la participación de 50 grupos musicales de diferentes países.',
      autor: 'Corresponsal Andino',
      destacada: false,
      descripcion: 'El Festival de Música Andina se realizó en Cusco con la participación de 50 grupos musicales de diferentes países.',
      imagen: 'festival_andino.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Festival de Música Andina'
    },
    {
      titulo: 'Chabuca Granda es homenajeada en el Día de la Canción Criolla',
      contenido: 'La compositora peruana Chabuca Granda fue homenajeada en el Día de la Canción Criolla con un concierto especial en el Teatro Municipal. El evento contó con la participación de artistas como Tania Libertad, Cecilia Bracamonte y Pepe Vásquez.',
      resumen: 'La compositora peruana Chabuca Granda fue homenajeada en el Día de la Canción Criolla con un concierto especial en el Teatro Municipal.',
      autor: 'Reportero de Homenajes',
      destacada: true,
      descripcion: 'La compositora peruana Chabuca Granda fue homenajeada en el Día de la Canción Criolla con un concierto especial en el Teatro Municipal.',
      imagen: 'chabuca_homenaje.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Teatro Municipal'
    },
    {
      titulo: 'Festival de Reggaetón reúne a artistas urbanos en Lima',
      contenido: 'El Festival de Reggaetón reunió a artistas urbanos en Lima con la participación de cantantes como Bad Bunny, J Balvin y Karol G. El evento se realizó en el Estadio Nacional y contó con la presencia de 30,000 espectadores.',
      resumen: 'El Festival de Reggaetón reunió a artistas urbanos en Lima con la participación de cantantes como Bad Bunny, J Balvin y Karol G.',
      autor: 'Reportero Urbano',
      destacada: false,
      descripcion: 'El Festival de Reggaetón reunió a artistas urbanos en Lima con la participación de cantantes como Bad Bunny, J Balvin y Karol G.',
      imagen: 'festival_reggaeton.jpg',
      fecha: '04 octubre 2025',
      fuente: 'Festival de Reggaetón Lima'
    }
  ]
};

// Datos de anunciantes
const anunciantesData = [
  {
    nombre_empresa: 'Restaurante El Rincón Criollo',
    contacto: 'María González',
    telefono: '+51 987 654 321',
    email: 'info@rinconriollo.com',
    direccion: 'Av. Arequipa 1234, Miraflores, Lima',
    descripcion: 'Los mejores sabores de la cocina criolla peruana en un ambiente acogedor y familiar. Especialistas en lomo saltado, ají de gallina y ceviche de pescado.',
    logo_url: 'rincon_criollo_logo.jpg',
    sitio_web: 'www.rinconriollo.com',
    nombre: 'Restaurante El Rincón Criollo',
    categoria: 'Gastronomía',
    horario: 'Lun-Dom: 12:00 PM - 11:00 PM',
    imagen: 'rincon_criollo.jpg',
    flyer: 'flyer_rincon_criollo.jpg'
  },
  {
    nombre_empresa: 'AutoServicio Express',
    contacto: 'Carlos Mendoza',
    telefono: '+51 955 444 333',
    email: 'servicio@autoservicioexpress.com',
    direccion: 'Av. Javier Prado 5678, San Isidro, Lima',
    descripcion: 'Taller mecánico especializado en mantenimiento preventivo y correctivo de vehículos. Servicio rápido, garantizado y con repuestos originales.',
    logo_url: 'autoservicio_logo.jpg',
    sitio_web: 'www.autoservicioexpress.com',
    nombre: 'AutoServicio Express',
    categoria: 'Automotriz',
    horario: 'Lun-Sáb: 8:00 AM - 6:00 PM',
    imagen: 'autoservicio_express.jpg',
    flyer: 'flyer_autoservicio.jpg'
  },
  {
    nombre_empresa: 'Clínica Dental Sonrisa Perfecta',
    contacto: 'Dra. Ana Rodríguez',
    telefono: '+51 944 333 222',
    email: 'citas@sonrisaperfecta.com',
    direccion: 'Av. Larco 9876, Miraflores, Lima',
    descripcion: 'Clínica dental especializada en ortodoncia, implantes y estética dental. Equipos de última generación y profesionales altamente capacitados.',
    logo_url: 'sonrisa_perfecta_logo.jpg',
    sitio_web: 'www.sonrisaperfecta.com',
    nombre: 'Clínica Dental Sonrisa Perfecta',
    categoria: 'Salud',
    horario: 'Lun-Vie: 9:00 AM - 7:00 PM, Sáb: 9:00 AM - 2:00 PM',
    imagen: 'sonrisa_perfecta.jpg',
    flyer: 'flyer_sonrisa_perfecta.jpg'
  },
  {
    nombre_empresa: 'Gimnasio Fitness Total',
    contacto: 'Roberto Silva',
    telefono: '+51 933 222 111',
    email: 'info@fitnessotal.com',
    direccion: 'Av. Benavides 3456, Surco, Lima',
    descripcion: 'Gimnasio moderno con equipos de última generación, clases grupales y entrenadores personalizados. Ambiente motivador para alcanzar tus objetivos fitness.',
    logo_url: 'fitness_total_logo.jpg',
    sitio_web: 'www.fitnessotal.com',
    nombre: 'Gimnasio Fitness Total',
    categoria: 'Deportes y Fitness',
    horario: 'Lun-Dom: 5:00 AM - 11:00 PM',
    imagen: 'fitness_total.jpg',
    flyer: 'flyer_fitness_total.jpg'
  },
  {
    nombre_empresa: 'Farmacia Salud y Vida',
    contacto: 'Lic. Patricia López',
    telefono: '+51 922 111 000',
    email: 'ventas@saludyvida.com',
    direccion: 'Av. Universitaria 7890, San Miguel, Lima',
    descripcion: 'Farmacia con más de 20 años de experiencia. Medicamentos, productos de belleza, suplementos y atención farmacéutica especializada.',
    logo_url: 'salud_vida_logo.jpg',
    sitio_web: 'www.saludyvida.com',
    nombre: 'Farmacia Salud y Vida',
    categoria: 'Salud',
    horario: 'Lun-Dom: 7:00 AM - 10:00 PM',
    imagen: 'salud_vida.jpg',
    flyer: 'flyer_salud_vida.jpg'
  },
  {
    nombre_empresa: 'Academia de Inglés Global',
    contacto: 'Prof. Michael Johnson',
    telefono: '+51 911 000 999',
    email: 'info@academiaglobal.com',
    direccion: 'Av. Angamos 2345, Miraflores, Lima',
    descripcion: 'Academia de inglés con profesores nativos y metodología comunicativa. Cursos para niños, jóvenes y adultos. Preparación para exámenes internacionales.',
    logo_url: 'academia_global_logo.jpg',
    sitio_web: 'www.academiaglobal.com',
    nombre: 'Academia de Inglés Global',
    categoria: 'Educación',
    horario: 'Lun-Vie: 8:00 AM - 9:00 PM, Sáb: 8:00 AM - 2:00 PM',
    imagen: 'academia_global.jpg',
    flyer: 'flyer_academia_global.jpg'
  },
  {
    nombre_empresa: 'Supermercado Mega Ahorro',
    contacto: 'Gerente General',
    telefono: '+51 900 999 888',
    email: 'gerencia@megaahorro.com',
    direccion: 'Av. Túpac Amaru 4567, Independencia, Lima',
    descripcion: 'Supermercado con los mejores precios de la zona. Productos frescos, abarrotes, carnes, lácteos y productos de limpieza. Descuentos especiales los fines de semana.',
    logo_url: 'mega_ahorro_logo.jpg',
    sitio_web: 'www.megaahorro.com',
    nombre: 'Supermercado Mega Ahorro',
    categoria: 'Comercio',
    horario: 'Lun-Dom: 6:00 AM - 11:00 PM',
    imagen: 'mega_ahorro.jpg',
    flyer: 'flyer_mega_ahorro.jpg'
  },
  {
    nombre_empresa: 'Hotel Boutique Los Jardines',
    contacto: 'Reservas',
    telefono: '+51 899 888 777',
    email: 'reservas@hotellosjardines.com',
    direccion: 'Calle Los Pinos 123, San Isidro, Lima',
    descripcion: 'Hotel boutique de lujo en el corazón de San Isidro. Habitaciones elegantes, spa, restaurante gourmet y servicio de primera clase.',
    logo_url: 'hotel_jardines_logo.jpg',
    sitio_web: 'www.hotellosjardines.com',
    nombre: 'Hotel Boutique Los Jardines',
    categoria: 'Turismo y Hotelería',
    horario: '24 horas',
    imagen: 'hotel_jardines.jpg',
    flyer: 'flyer_hotel_jardines.jpg'
  },
  {
    nombre_empresa: 'Librería El Saber',
    contacto: 'Librero Principal',
    telefono: '+51 888 777 666',
    email: 'ventas@elsaber.com',
    direccion: 'Av. Larco 5678, Miraflores, Lima',
    descripcion: 'Librería especializada en libros técnicos, literatura, cómics y material educativo. Servicio de búsqueda de libros agotados y pedidos especiales.',
    logo_url: 'el_saber_logo.jpg',
    sitio_web: 'www.elsaber.com',
    nombre: 'Librería El Saber',
    categoria: 'Educación y Cultura',
    horario: 'Lun-Sáb: 9:00 AM - 8:00 PM',
    imagen: 'el_saber.jpg',
    flyer: 'flyer_el_saber.jpg'
  },
  {
    nombre_empresa: 'Café Artesanal La Taza',
    contacto: 'Barista Principal',
    telefono: '+51 877 666 555',
    email: 'info@lataza.com',
    direccion: 'Jr. de la Unión 2345, Centro de Lima',
    descripcion: 'Café artesanal con granos seleccionados de las mejores fincas del país. Ambiente acogedor, wifi gratis y deliciosos postres caseros.',
    logo_url: 'la_taza_logo.jpg',
    sitio_web: 'www.lataza.com',
    nombre: 'Café Artesanal La Taza',
    categoria: 'Gastronomía',
    horario: 'Lun-Dom: 7:00 AM - 10:00 PM',
    imagen: 'la_taza.jpg',
    flyer: 'flyer_la_taza.jpg'
  }
];

async function insertData() {
  let connection;
  
  try {
    // Conectar a la base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a la base de datos MySQL');

    // Insertar noticias por categoría
    for (const [categoria, noticias] of Object.entries(noticiasData)) {
      console.log(`\nInsertando noticias de categoría: ${categoria}`);
      
      for (const noticia of noticias) {
        const query = `
          INSERT INTO noticias (
            titulo, contenido, resumen, categoria, autor, destacada, 
            descripcion, imagen, fecha, fuente, fecha_publicacion, activa
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        `;
        
        const values = [
          noticia.titulo,
          noticia.contenido,
          noticia.resumen,
          categoria,
          noticia.autor,
          noticia.destacada,
          noticia.descripcion,
          noticia.imagen,
          noticia.fecha,
          noticia.fuente,
          true
        ];
        
        await connection.execute(query, values);
        console.log(`✓ Insertada: ${noticia.titulo}`);
      }
    }

    // Insertar anunciantes
    console.log('\nInsertando anunciantes...');
    for (const anunciante of anunciantesData) {
      const query = `
        INSERT INTO anunciantes (
          nombre_empresa, contacto, telefono, email, direccion, descripcion,
          logo_url, sitio_web, activo, nombre, categoria, horario, imagen, flyer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        anunciante.nombre_empresa,
        anunciante.contacto,
        anunciante.telefono,
        anunciante.email,
        anunciante.direccion,
        anunciante.descripcion,
        anunciante.logo_url,
        anunciante.sitio_web,
        true,
        anunciante.nombre,
        anunciante.categoria,
        anunciante.horario,
        anunciante.imagen,
        anunciante.flyer
      ];
      
      await connection.execute(query, values);
      console.log(`✓ Insertado: ${anunciante.nombre_empresa}`);
    }

    console.log('\n✅ Datos insertados exitosamente!');
    console.log(`📰 Noticias insertadas: ${Object.values(noticiasData).flat().length}`);
    console.log(`🏢 Anunciantes insertados: ${anunciantesData.length}`);

  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Conexión cerrada');
    }
  }
}

// Ejecutar el script
insertData();
