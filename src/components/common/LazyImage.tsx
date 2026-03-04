/* ========================================== */
/* IMPORTS Y DEPENDENCIAS                     */
/* ========================================== */

import React, { useState, useEffect } from 'react';

/* ========================================== */
/* INTERFACES Y TIPOS*/
/* ========================================== */

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  preload?: boolean;
}

/* ========================================== */
/* COMPONENTE PRINCIPAL                       */
/* ========================================== */
/**
 * Imagen con carga diferida y transición suave (fade-in).
 * Opcionalmente inyecta un tag `<link rel="preload">` dinámicamente
 * al DOM document.head si es crítico para el Largest Contentful Paint (LCP),
 * forzando la petición HTTP anticipada antes de que React renderice el tag img.
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  preload = false,
  className = '',
  style,
  ...restProps
}) => {
  /* ========================================== */
  /* ESTADOS Y REFERENCIAS                      */
  /* ========================================== */

  const [isLoaded, setIsLoaded] = useState(false);

  /* ========================================== */
  /* EFECTOS Y CICLO DE VIDA                    */
  /* ========================================== */

  useEffect(() => {
    // Si preload es true, fuerza la solicitud temprana de la imagen inyectando la etiqueta en el head
    if (preload && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [preload, src]);

  /* ========================================== */
  /* RENDERIZADO (UI / JSX)                     */
  /* ========================================== */
  return (
    <img
      src={src}
      alt={alt}
      loading={preload ? 'eager' : 'lazy'}
      decoding="async"
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={() => setIsLoaded(true)}
      style={{
        transition: 'opacity 0.3s ease-out',
        opacity: isLoaded ? 1 : 0,
        ...style,
      }}
      {...restProps}
    />
  );
};

export default LazyImage;

