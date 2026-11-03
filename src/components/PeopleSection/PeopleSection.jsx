import React from "react";
import "./PeopleSection.scss";
import PeopleList from "../PeopleList/PeopleList";

function PeopleSection({ people, authenticated, onClearDraw }) {
  return (
    <section aria-labelledby="list-title" className="panel list-panel">
      <div className="section-heading">
        <h2 id="list-title">Jugadores inscritos</h2>
        <div className="list-actions">
          <span className="count-pill">{people.length} inscritos</span>
          {authenticated && (
            <button
              className="button button-light clear-draw-button"
              disabled={people.length === 0}
              onClick={onClearDraw}
              type="button"
            >
              Limpiar sorteo
            </button>
          )}
        </div>
      </div>
      <div className="list-meta">
        <span>Personaje y número del sorteo</span>
        <span>00 — 99</span>
      </div>
      <PeopleList people={people} />
    </section>
  );
}

export default PeopleSection;
