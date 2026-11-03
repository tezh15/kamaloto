import React from "react";
import "./AdminPanel.scss";

function AdminPanel({ ticketPrice }) {
  const formattedPrice = new Intl.NumberFormat("es-CO").format(ticketPrice);

  return (
    <section className="panel form-panel admin-panel">
      <h2>Panel del organizador</h2>
      <p className="form-description">
        Inicia sesión para configurar el precio, inscribir jugadores y asignarles un número para el sorteo de mks.
      </p>
      <p className="form-message">
        Precio actual por puesto: {formattedPrice} kamas. Las inscripciones se guardan en este navegador.
      </p>
    </section>
  );
}

export default AdminPanel;
