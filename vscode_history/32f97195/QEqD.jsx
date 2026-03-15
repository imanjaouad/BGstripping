import React from 'react';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #ffffff;
  }

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }

  .header {
    position: relative;
    background-color: #2563eb;
    padding: 4px 0;
  }

  .diagonal {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: #1d4ed8;
    transform: skewX(-12deg);
    z-index: 0;
  }

  .logo-container {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  .logo-box {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    color: white;
    font-size: 48px;
  }

  .logo-text {
    font-size: 24px;
    font-weight: bold;
    color: white;
  }

  .logo-subtitle {
    color: #dbeafe;
    font-style: italic;
    font-size: 14px;
  }

  .main-content {
    position: relative;
    z-index: 10;
    padding: 64px 32px;
    flex: 1;
  }

  .text-section {
    margin-bottom: 128px;
    padding-left: 32px;
  }

  .title {
    font-size: 60px;
    font-weight: 900;
    color: #111827;
    line-height: 1.2;
    margin-bottom: 24px;
  }

  .underline {
    height: 8px;
    width: 192px;
    background-color: #2563eb;
    margin-top: 8px;
    margin-bottom: 24px;
  }

  .triangles-container {
    width: 100%;
    background-color: white;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0;
  }

  .triangle {
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 80px solid #2563eb;
  }
`;

export default function EtudiaLanding() {
  return (
    <>
      <style>{styles}</style>
      <div className="container">
        {/* Header avec fond bleu */}
        <div className="header">
          {/* Diagonale en haut à droite */}
          <div className="diagonal"></div>
          
          {/* Logo et titre */}
          <div className="logo-container">
            <div className="logo-box">
              <span className="logo-icon">🎓</span>
            </div>
            <h1 className="logo-text">Etudia</h1>
            <p className="logo-subtitle">Learn more</p>
          </div>
        </div>

        {/* Container principal */}
        <div className="main-content">
          {/* Texte principal */}
          <div className="text-section">
            <h2 className="title">
              Bienvenue,
              <div className="underline"></div>
            </h2>
            
            <h3 className="title">
              Cher<br />
              Apprenant,
              <div className="underline"></div>
            </h3>
          </div>
        </div>

        {/* Triangles décorativement en haut */}
        <div className="triangles-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="triangle"></div>
          ))}
        </div>
      </div>
    </>
  );
}