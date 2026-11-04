import React from "react";
import "./AdminPanel.scss";

function AdminPanel({ dataError, dataStatus, ticketPrice }) {
  const formattedPrice = new Intl.NumberFormat("es-CO").format(ticketPrice);

  return (
    <section className="panel form-panel admin-panel">
      <h2>Panel del organizador</h2>
      <p className="form-description">
        Inicia sesión para configurar el precio, inscribir jugadores y asignarles un número para el sorteo de mks.
      </p>
      <p className="form-message">
        Precio actual por puesto: {formattedPrice} kamas. Los datos se sincronizan en tiempo real con Firebase.
      </p>
      {dataStatus === "loading" && <p className="form-message" role="status">Conectando con Firebase…</p>}
      {dataError && <p className="form-error" role="alert">No se pudieron cargar los datos: {dataError}</p>}
    </section>
  );
}

export default AdminPanel;
