import React from 'react';
import '../styles/BackgroundElements.css';

const BackgroundElements = () => {
  return (
    <div className="background-elements">
      {/* Figuras geométricas - idea de dribbble */}
      <div className="triangle" style={{ top: '15%', right: '5%' }}></div>
      <div className="triangle" style={{ top: '65%', left: '8%' }}></div>
      <div className="triangle" style={{ top: '85%', right: '15%' }}></div>
      
      {/* Matriz de puntos - efecto moderno */}
      <div className="dots-group" style={{ top: '30%', left: '7%' }}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      
      <div className="dots-group" style={{ bottom: '20%', right: '7%' }}>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      
      {/* Elementos decorativos extra - probar otros colores */}
      <div className="shape circle" style={{ top: '55%', right: '10%' }}></div>
      <div className="shape ring" style={{ top: '20%', left: '15%' }}></div>
      
      {/* Líneas laterales - dan profundidad */}
      <div className="line" style={{ top: '45%', left: '0' }}></div>
      <div className="line" style={{ bottom: '35%', right: '0' }}></div>
    </div>
  );
};

export default BackgroundElements;
