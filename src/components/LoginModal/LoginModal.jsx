import React, { useState } from "react";
import "./LoginModal.scss";
import kamalotoLogo from "url:../../../public/assets/kamaloto.png";

const ADMIN_USER = process.env.ADMIN_USER || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

function LoginModal({ onLogin, onContinueAsGuest }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!ADMIN_USER || !ADMIN_PASSWORD) {
      setError("El acceso del organizador no está configurado.");
      return;
    }
    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    setError("");
    onLogin();
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
            <label htmlFor="admin-user">Usuario del organizador</label>
            <input
              autoComplete="username"
              id="admin-user"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Tu usuario"
              required
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
          <button className="button button-dark" type="submit">Entrar al sorteo <span aria-hidden="true">→</span></button>
        </form>
        <button
          className="button button-light guest-button"
          onClick={onContinueAsGuest}
          type="button"
        >
          Ingresar como visitante
        </button>
      </section>
    </div>
  );
}

export default LoginModal;
