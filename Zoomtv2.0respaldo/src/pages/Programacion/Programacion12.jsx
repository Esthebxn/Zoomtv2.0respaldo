import React, { useState, useEffect } from "react";
import "./Programacion12.css";
import apiService from "../../services/api";

export default function Programacion12() {
  const [selectedDay, setSelectedDay] = useState("lunes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [programacionData, setProgramacionData] = useState({});

  // Cargar programación de la API
  useEffect(() => {
    const loadProgramacion = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProgramacion();
        
        // Organizar datos por día de la semana
        const programacionPorDia = {
          lunes: [],
          martes: [],
          miercoles: [],
          jueves: [],
          viernes: [],
          sabado: [],
          domingo: []
        };

        data.forEach(programa => {
          // Mapear días de la semana con acentos a claves sin acentos
          const diaMapping = {
            'Lunes': 'lunes',
            'Martes': 'martes', 
            'Miércoles': 'miercoles',
            'Jueves': 'jueves',
            'Viernes': 'viernes',
            'Sábado': 'sabado',
            'Domingo': 'domingo'
          };
          
          const dia = diaMapping[programa.dia_semana] || programa.dia_semana.toLowerCase();
          if (programacionPorDia[dia]) {
            programacionPorDia[dia].push({
              id: programa.id,
              hora: programa.hora,
              programa: programa.nombre_programa,
              descripcion: programa.descripcion,
              categoria: programa.categoria
            });
          }
        });

        setProgramacionData(programacionPorDia);
      } catch (err) {
        console.error('Error cargando programación:', err);
        setError('Error al cargar la programación');
      } finally {
        setLoading(false);
      }
    };

    loadProgramacion();
  }, []);


  const days = [
    { id: "lunes", name: "Lunes" },
    { id: "martes", name: "Martes" },
    { id: "miercoles", name: "Miércoles" },
    { id: "jueves", name: "Jueves" },
    { id: "viernes", name: "Viernes" },
    { id: "sabado", name: "Sábado" },
    { id: "domingo", name: "Domingo" }
  ];


  const handleDayChange = (day) => {
    setSelectedDay(day);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Recargar datos de la API
    const loadProgramacion = async () => {
      try {
        const data = await apiService.getProgramacion();
        
        // Organizar datos por día de la semana
        const programacionPorDia = {
          lunes: [],
          martes: [],
          miercoles: [],
          jueves: [],
          viernes: [],
          sabado: [],
          domingo: []
        };

        data.forEach(programa => {
          // Mapear días de la semana con acentos a claves sin acentos
          const diaMapping = {
            'Lunes': 'lunes',
            'Martes': 'martes', 
            'Miércoles': 'miercoles',
            'Jueves': 'jueves',
            'Viernes': 'viernes',
            'Sábado': 'sabado',
            'Domingo': 'domingo'
          };
          
          const dia = diaMapping[programa.dia_semana] || programa.dia_semana.toLowerCase();
          if (programacionPorDia[dia]) {
            programacionPorDia[dia].push({
              id: programa.id,
              hora: programa.hora,
              programa: programa.nombre_programa,
              descripcion: programa.descripcion,
              categoria: programa.categoria
            });
          }
        });

        setProgramacionData(programacionPorDia);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando programación:', err);
        setError('Error al cargar la programación');
      setLoading(false);
      }
    };

    loadProgramacion();
  };

  if (error) {
    return (
      <div className="programacion-container">
        <div className="error-container">
          <div className="error-message">
            {error}
          </div>
          <button className="retry-button" onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Solo mostrar "No hay programación disponible" si no está cargando y no hay datos
  if (!loading && (!programacionData || Object.keys(programacionData).length === 0)) {
    return (
      <div className="programacion-container">
        <header className="programacion-header">
          <h1>PROGRAMACIÓN CANAL 12</h1>
          <h2>Tu canal de entretenimiento las 24 horas</h2>
          <p>Consulta nuestra programación completa por días</p>
        </header>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay programación disponible</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="programacion-container">
      <header className="programacion-header">
        <h1>PROGRAMACIÓN CANAL 12</h1>
        <h2>Tu canal de entretenimiento las 24 horas</h2>
        <p>Consulta nuestra programación completa por días</p>
      </header>

      <div className="filter-buttons">
        {days.map((day) => (
          <button
            key={day.id}
            className={`filter-button ${selectedDay === day.id ? 'active' : ''}`}
            onClick={() => handleDayChange(day.id)}
          >
            {day.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando programación...</p>
        </div>
      ) : (
        <div className="schedule-day">
          <div className="schedule">
            <div className="day-header">
              {days.find(day => day.id === selectedDay)?.name}
            </div>
            
            {programacionData[selectedDay] && programacionData[selectedDay].length > 0 ? (
              <table className="programs-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Programa</th>
                  </tr>
                </thead>
                <tbody>
                  {programacionData[selectedDay].map((programa) => (
                    <tr key={programa.id} className="program-item">
                      <td className="program-time">
                        {programa.hora}
                      </td>
                      <td className="program-info">
                        <h3>{programa.programa}</h3>
                        <p>{programa.descripcion}</p>
                        <span className="program-category">
                          {programa.categoria}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-programs">
                No hay programación disponible para este día
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}    