import React from "react";
import "./Accumulated.scss";

function Accumulated({ peopleCount, ticketPrice }) {
  const amount = peopleCount * ticketPrice;
  const formatKamas = (value) => new Intl.NumberFormat("es-CO").format(value);
  const formattedPrice = new Intl.NumberFormat("es-CO").format(ticketPrice);

  return (
    <section aria-labelledby="accumulated-title" className="panel accumulated-panel">
      <p className="eyebrow"><span className="eyebrow-dot" /> Pozo del sorteo</p>
      <h2 id="accumulated-title">Premio para el ganador</h2>
      <p className="accumulated-amount">{formatKamas(amount)}</p>
      <p className="accumulated-currency">kamas</p>
      <p className="accumulated-detail">
        {peopleCount} {peopleCount === 1 ? "puesto" : "puestos"} × {formattedPrice} kamas
      </p>
      <div className="accumulated-breakdown">
        <p>
          <span>Premio para el ganador (100 %)</span>
          <span>{formatKamas(amount)} kamas</span>
        </p>
      </div>
    </section>
  );
}

export default Accumulated;
