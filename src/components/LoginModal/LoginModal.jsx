import React, { useState } from "react";
import "./LoginModal.scss";
import kamalotoLogo from "url:../../../public/assets/kamaloto.png";

function LoginModal({ onLogin, onContinueAsGuest }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const credentialsComplete = username.trim().length > 0 && password.length > 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onLogin(username, password);
    } catch (loginError) {
      if (loginError?.message === "Esta cuenta no está autorizada como organizador.") {
        setError(loginError.message);
      } else {
        console.log("No se pudo iniciar sesión:", loginError);
        setError("No se pudo iniciar sesión. Comprueba el correo y la contraseña.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <section
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <div className="modal-heading">
          <img alt="Kamaloto" className="modal-logo" src={kamalotoLogo} />
        </div>
        <h2 id="login-title">Gestiona el sorteo</h2>
        <p className="login-intro">Inicia sesión para administrar las inscripciones y los números del sorteo.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="admin-user">Correo del organizador</label>
            <input
              autoComplete="username"
              id="admin-user"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="nombre@ejemplo.com"
              required
              type="email"
              value={username}
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Contraseña</label>
            <input
              autoComplete="current-password"
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              required
              type="password"
              value={password}
            />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button
            className="button button-dark"
            disabled={submitting || !credentialsComplete}
            type="submit"
          >
            {submitting ? "Iniciando sesión..." : "Ingresar como Organizador"} <span aria-hidden="true">→</span>
          </button>
        </form>
        <button
          className="button button-light guest-button"
          onClick={onContinueAsGuest}
          type="button"
        >
          Ingresar como Jugador
        </button>
      </section>
    </div>
  );
}

export default LoginModal;
