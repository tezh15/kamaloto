import React from "react";
import "./HeroSection.scss";

function HeroSection({ peopleCount }) {
  return (
    <section className="hero">
      <p className="eyebrow"><span className="eyebrow-dot" /> Sorteo entre jugadores de Dofus</p>
      <h1>Que la suerte de Jiva esté contigo</h1>
      <p className="hero-copy">
        Inscribe a los jugadores y asigna sus números para participar por el pozo de mks.
      </p>
      <div className="hero-count">
        <strong>{String(peopleCount).padStart(2, "0")}</strong>
        <span>de 100 números</span>
      </div>
    </section>
  );
}

export default HeroSection;
