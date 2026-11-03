import React from "react";
import "./SiteHeader.scss";
import kamalotoLogo from "url:../../../public/assets/kamaloto.png";

function SiteHeader({ authenticated, onLoginClick, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img alt="Kamaloto" className="header-logo" src={kamalotoLogo} />
      </div>
      <div className="topbar-actions">
        {authenticated ? (
          <>
            <span className="admin-label">Organizador del sorteo</span>
            <button className="button button-light" onClick={onLogout} type="button">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <span className="admin-label">Sorteo de mks · Dofus</span>
            <button className="button button-light" onClick={onLoginClick} type="button">
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
