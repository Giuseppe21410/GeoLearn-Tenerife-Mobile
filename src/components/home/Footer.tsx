/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React from 'react';
import '../../assets/css/Home/Footer.css';

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */

/**
 * Pie de página decorativo de la vista Home.
 * Simple render que actúa como ancla visual para el límite de scroll de la página.
 */
const Footer: React.FC = () => {

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */

  return (
    <footer
      className="footer-container"
      aria-label="Degradado decorativo color azulado."
    >
    </footer>
  );
};

export default Footer;