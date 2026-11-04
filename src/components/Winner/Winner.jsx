import React from "react";
import "./Winner.scss";

function Winner({ lotteryResult, people }) {
  const winningNumber = lotteryResult.result?.winningNumber;
  const winner = winningNumber
    ? people.find((person) => person.number === Number(winningNumber))
    : null;

  return (
    <section aria-labelledby="winner-title" className="panel winner-panel">
      <p className="eyebrow"><span className="eyebrow-dot" /> Resultado de la lotería</p>
      <h2 id="winner-title">Ganador del sorteo</h2>
      {lotteryResult.status === "loading" && (
        <p className="winner-note">Consultando el número ganador…</p>
      )}
      {lotteryResult.status === "scheduled" && (
        <p className="winner-note">
          El primer sorteo será el miércoles 11 de noviembre a las 10:30 p. m. (hora Colombia).
        </p>
      )}
      {lotteryResult.status === "error" && (
        <p className="winner-note">No se pudo consultar el resultado de la lotería.</p>
      )}
      {lotteryResult.status === "loaded" && !winningNumber && (
        <p className="winner-note">Aún no hay un resultado de lotería disponible.</p>
      )}
      {lotteryResult.status === "loaded" && winningNumber && winner && (
        <div className="winner-details">
          <span aria-label={`Número ganador ${winningNumber}`} className="winner-number">
            {winningNumber}
          </span>
          <div>
            <p className="winner-name">{winner.name}</p>
            <p className="winner-caption">Ganó con el número {winningNumber}</p>
          </div>
        </div>
      )}
      {lotteryResult.status === "loaded" && winningNumber && !winner && (
        <p className="winner-note">
          El número {winningNumber} salió en la lotería, pero no hubo ganador en este sorteo.
          Los jugadores inscritos y el pozo se mantienen para el próximo sorteo del miércoles.
        </p>
      )}
    </section>
  );
}

export default Winner;
