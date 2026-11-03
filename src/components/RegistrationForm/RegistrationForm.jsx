import React from "react";
import "./RegistrationForm.scss";

function RegistrationForm({
  peopleCount,
  name,
  number,
  message,
  storageError,
  ticketPrice,
  onNameChange,
  onNumberChange,
  onTicketPriceChange,
  onSubmit,
}) {
  const isFull = peopleCount >= 100;

  return (
    <section className="panel form-panel registration-form">
      <h2>Inscribir jugador</h2>
      <p className="form-description">Registra su personaje y asígnale un número del 00 al 99.</p>
      <div className="field">
        <label htmlFor="ticket-price">Precio por puesto</label>
        <select
          id="ticket-price"
          onChange={(event) => onTicketPriceChange(event.target.value)}
          value={ticketPrice}
        >
          <option value={500000}>500.000 kamas</option>
          <option value={1000000}>1.000.000 kamas</option>
        </select>
        <span className="price-description">Cada jugador debe pagar este monto por su puesto.</span>
      </div>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="person-name">Nombre del personaje</label>
          <input
            autoComplete="off"
            id="person-name"
            maxLength={80}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Tu nombre en Dofus"
            required
            value={name}
          />
        </div>
        <div className="field">
          <label htmlFor="person-number">Número del sorteo (00–99)</label>
          <input
            id="person-number"
            inputMode="numeric"
            max="99"
            min="0"
            onChange={(event) => onNumberChange(event.target.value)}
            placeholder="Ej. 07"
            required
            type="number"
            value={number}
          />
        </div>
        <button className="button button-dark" disabled={isFull} type="submit">
          {isFull ? "Sorteo completo" : "Inscribir jugador"}
        </button>
        {(message || storageError) && (
          <p className={storageError ? "form-error" : "form-message"} role="status">
            {storageError || message}
          </p>
        )}
      </form>
      <div
        aria-label={`${peopleCount}% de los números ocupados`}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={peopleCount}
        className="progress-track"
        role="progressbar"
      >
        <div className="progress-fill" style={{ width: `${peopleCount}%` }} />
      </div>
      <div className="progress-copy">
        <span>{peopleCount} ocupados</span>
        <span>{100 - peopleCount} disponibles</span>
      </div>
    </section>
  );
}

export default RegistrationForm;
