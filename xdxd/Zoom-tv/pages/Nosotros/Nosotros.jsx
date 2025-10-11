import React, { useState, useEffect } from "react";
import "./Nosotros.css";
import apiService from "../../services/api";

// ✅ Imágenes locales (cada sección independiente)
import logoZoom from "../../assets/images/logoZoomtv.png"; 
import historiaImg from "../../assets/images/chatbot_logo.png";
import misionImg from "../../assets/images/profesional3.jpg";
import visionImg from "../../assets/images/profesional5.jpg";
import equipoCompletoImg from "../../assets/images/equipo.png";

// ✅ Miembros del equipo
import mariaGonzalez from "../../assets/images/profesional1.jpg";
import carlosMendoza from "../../assets/images/profesional2.jpg";
import lauraJimenez from "../../assets/images/profesional4.jpg";
import robertoSanchez from "../../assets/images/profesional6.jpg";

const Nosotros = () => {
  const [nosotrosData, setNosotrosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos de la API
  useEffect(() => {
    const loadNosotrosData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getNosotros();
        setNosotrosData(data);
      } catch (err) {
        console.error('Error cargando datos de nosotros:', err);
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    loadNosotrosData();
  }, []);

  // Datos dinámicos desde la API
  const companyInfo = nosotrosData ? {
    name: nosotrosData.nombre_empresa,
    slogan: nosotrosData.slogan,
    contactInfo: {
      email: nosotrosData.email,
      phone: nosotrosData.telefono,
    },
  } : null;

  // 🧑‍💼 Equipo de trabajo - datos dinámicos desde la API
  const teamMembers = []; // El campo equipo es texto simple, no JSON

  // 🕰 Historia
  const companyHistory = {
    title: "Nuestra Historia",
    content: nosotrosData?.historia || "No hay información disponible",
    image: historiaImg,
  };

  // 🎯 Misión y Visión
  const companyValues = {
    mission: {
      title: "Nuestra Misión",
      content: nosotrosData?.mision || "No hay información disponible",
      image: misionImg,
    },
    vision: {
      title: "Nuestra Visión",
      content: nosotrosData?.vision || "No hay información disponible",
      image: visionImg,
    },
  };

  if (loading) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando información...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  if (!nosotrosData) {
    return (
      <div className="nosotros-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>No hay información disponible</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="nosotros-container">
      {/* 🟣 Banner superior */}
      <div className="nosotros-banner">
        <img
          src={logoZoom}
          alt={`Logo ${companyInfo.name}`}
          className="logo-canal"
        />
        <h1>{companyInfo.name}</h1>
        <p>{companyInfo.slogan}</p>
      </div>

      {/* 🟢 Introducción */}
      <div className="nosotros-header">
        <h2>Conoce nuestro equipo y valores</h2>
        <p>Somos un equipo comprometido con la excelencia en la comunicación</p>
      </div>

      {/* 🟡 Equipo */}
      <div className="equipo-section">
        <h2>Nuestro Equipo</h2>
        
        <div className="equipo-completo">
          <img
            src={equipoCompletoImg}
            alt="Equipo completo de Zoom TV Canal 10"
          />
          <p>
            {nosotrosData?.equipo || "Nuestro equipo completo de más de 50 profesionales trabajando para ustedes"}
          </p>
        </div>
      </div>

      {/* 🔵 Historia */}
      <div className="nosotros-sections">
        <div className="nosotros-section historia">
          <div className="section-image">
            <img src={companyHistory.image} alt="Historia del canal" />
          </div>
          <div className="section-content">
            <h2>{companyHistory.title}</h2>
            {companyHistory.content.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* 🔴 Misión */}
        <div className="nosotros-section mision reverse">
          <div className="section-image">
            <img
              src={companyValues.mission.image}
              alt="Misión de Zoom TV Canal 10"
            />
          </div>
          <div className="section-content">
            <h2>{companyValues.mission.title}</h2>
            <p>{companyValues.mission.content}</p>
          </div>
        </div>

        {/* 🟢 Visión */}
        <div className="nosotros-section vision">
          <div className="section-image">
            <img
              src={companyValues.vision.image}
              alt="Visión de Zoom TV Canal 10"
            />
          </div>
          <div className="section-content">
            <h2>{companyValues.vision.title}</h2>
            <p>{companyValues.vision.content}</p>
          </div>
        </div>
      </div>

      {/* 🟣 Contacto */}
      <div className="contacto-section">
        <p>
          Envíanos tu información a:{" "}
          <a href={`mailto:${companyInfo.contactInfo.email}`}>
            {companyInfo.contactInfo.email}
          </a>
        </p>
        <p>
          O llámanos al:{" "}
          <a href={`tel:${companyInfo.contactInfo.phone}`}>
            {companyInfo.contactInfo.phone}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Nosotros;
 