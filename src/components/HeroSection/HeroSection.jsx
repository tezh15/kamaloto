import React, { useState } from "react";
import "./HeroSection.scss";

function HeroSection({ authenticated, dataStatus, people, peopleCount }) {
  const [number, setNumber] = useState("");
  const [checkedNumber, setCheckedNumber] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  const isNumberTaken = checkedNumber !== null
    && people.some((person) => person.number === checkedNumber);

  function handleSubmit(event) {
    event.preventDefault();
    if (!/^\d{1,2}$/.test(number)) {
      setCheckedNumber(null);
      setValidationMessage("Introduce un número entre 00 y 99.");
      return;
    }

    setValidationMessage("");
    setCheckedNumber(Number(number));
  }

  return (
    <section className="hero">
      <p className="eyebrow"><span className="eyebrow-dot" /> Sorteo entre jugadores de Dofus</p>
      <h1>Que la suerte de Jiva esté contigo</h1>
      <p className="hero-copy">
        Inscribe a los jugadores y asigna sus números para participar por el pozo de mks.
      </p>
      {!authenticated && (
        <div className="number-checker">
          <form onSubmit={handleSubmit}>
            <label htmlFor="number-check">Comprueba si un número está disponible</label>
            <div className="number-checker-controls">
              <input
                autoComplete="off"
                disabled={dataStatus !== "ready"}
                id="number-check"
                inputMode="numeric"
                maxLength={2}
                onChange={(event) => {
                  setNumber(event.target.value);
                  setCheckedNumber(null);
                  setValidationMessage("");
                }}
                placeholder="Ej. 07"
                value={number}
              />
              <button className="button button-dark" disabled={dataStatus !== "ready"} type="submit">
                Consultar
              </button>
            </div>
          </form>
          {dataStatus === "loading" && (
            <p className="number-checker-message" role="status">Cargando números del sorteo…</p>
          )}
          {dataStatus === "error" && (
            <p className="number-checker-message number-checker-error" role="alert">
              No se pudieron cargar los números. Inténtalo de nuevo más tarde.
            </p>
          )}
          {validationMessage && (
            <p className="number-checker-message number-checker-error" role="alert">
              {validationMessage}
            </p>
          )}
          {checkedNumber !== null && dataStatus === "ready" && (
            <p
              className={`number-checker-message ${isNumberTaken ? "number-checker-error" : "number-checker-free"}`}
              role="status"
            >
              El número {String(checkedNumber).padStart(2, "0")}{" "}
              {isNumberTaken ? "ya está tomado." : "está libre."}
            </p>
          )}
        </div>
      )}
      <div className="hero-count">
        <strong>{String(peopleCount).padStart(2, "0")}</strong>
        <span>de 100 números</span>
      </div>
    </section>
  );
}

export default HeroSection;
