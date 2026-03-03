import React from 'react';
import { Browser } from '@capacitor/browser';
import Form from '../components/home/Form';
import Counter from '../components/home/Counter';
import ChatBot from '../components/home/ChatBot';
import StatsSection from '../components/home/StatsSection';
import Introduction from '../components/home/Introduction';
import CategoryGrid from '../components/home/CategoryGrid';
import Footer from '../components/home/Footer';
import LazyImage from '../components/common/LazyImage';
import '../assets/css/Home/Home.css';
import '../assets/css/Tooltip.css';
import CabildoLogo from '../assets/img/logo-cabildo.webp';
import WebLogo from '../assets/img/logo-pagina.webp';


const Home: React.FC = () => {
  const openCabildoUrl = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await Browser.open({ url: 'https://www.tenerife.es' });
    } catch (err) {
      console.error('Error opening browser:', err);
    }
  };

  return (
    <main className="home-container">
      <section
        className="hero-section"
        aria-labelledby="home-hero-heading"
      >
        <div className="parallax-bg" role="presentation" aria-hidden="true"></div>
        <div className="overlay" role="presentation" aria-hidden="true"></div>

        <div className="icon-cabildo">
          <a
            href="https://www.tenerife.es"
            onClick={openCabildoUrl}
            aria-label="Abrir sitio web del Cabildo de Tenerife"
          >
            <LazyImage src={CabildoLogo} alt="" role="presentation" aria-hidden="true" />
          </a>
        </div>

        <header className="home-header">
          <div className="icon-page-img">
            <LazyImage
              src={WebLogo}
              alt="GeoLearn Tenerife, plataforma de centros educativos, bibliotecas y espacios de estudio"
              preload={true}
            />
          </div>
          <h1 className="subtitle" id="home-hero-heading">
            Tu red de centros educativos, bibliotecas y espacios de estudio a un clic.
          </h1>
          <Form />
        </header>
      </section>

      <section
        className="info-section"
        aria-label="Información y herramientas de búsqueda de centros educativos"
      >
        <div className="home-content">
          <Introduction />
          <CategoryGrid />
          <Counter />
          <StatsSection />
          <Footer />
        </div>
      </section>

      <ChatBot />
    </main>
  );
};
export default Home;
