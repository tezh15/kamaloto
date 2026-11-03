import React, { useEffect } from "react";
import "./WinnerPopup.scss";

function WinnerPopup({ winner, winningNumber, prize, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const formattedPrize = new Intl.NumberFormat("es-CO").format(prize);

  return (
    <div className="winner-popup-backdrop">
      <section
        aria-labelledby="winner-popup-title"
        aria-modal="true"
        className="winner-popup"
        role="dialog"
      >
        <p className="eyebrow"><span className="eyebrow-dot" /> ¡Tenemos ganador!</p>
        <h2 id="winner-popup-title">¡Felicitaciones!</h2>
        <p className="winner-popup-intro">El número ganador del sorteo pertenece a:</p>
        <div className="winner-popup-details">
          <span aria-label={`Número ganador ${winningNumber}`} className="winner-popup-number">
            {winningNumber}
          </span>
          <p className="winner-popup-name">{winner.name}</p>
        </div>
        <p className="winner-popup-prize">
          Premio: <strong>{formattedPrize} kamas</strong>
        </p>
        <button className="button button-dark" onClick={onClose} type="button">
          Continuar
        </button>
      </section>
    </div>
  );
}

export default WinnerPopup;
