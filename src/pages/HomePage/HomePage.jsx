import React, { useState } from "react";
import "./HomePage.scss";
import Accumulated from "../../components/Accumulated/Accumulated";
import AdminPanel from "../../components/AdminPanel/AdminPanel";
import HeroSection from "../../components/HeroSection/HeroSection";
import LoginModal from "../../components/LoginModal/LoginModal";
import PeopleSection from "../../components/PeopleSection/PeopleSection";
import PreviousResult from "../../components/PreviousResult/PreviousResult";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import Winner from "../../components/Winner/Winner";
import WinnerPopup from "../../components/WinnerPopup/WinnerPopup";
import { useAppContext } from "../../context";

function HomePage({ authenticated, onLogin, onLogout }) {
  const {
    people,
    ticketPrice,
    dataStatus,
    dataError,
    addPerson,
    clearDraw,
    updateTicketPrice,
  } = useAppContext();
  const [lotteryResult, setLotteryResult] = useState({ status: "loading", result: null });
  const [dismissedWinnerKey, setDismissedWinnerKey] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(!authenticated);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const winningNumber = lotteryResult.result?.winningNumber;
  const winner = winningNumber
    ? people.find((person) => person.number === Number(winningNumber))
    : null;
  const winnerKey = lotteryResult.result?.drawId || "";
  const totalPrize = people.length * ticketPrice;
  const winnerPrize = totalPrize - Math.floor(totalPrize * 0.1);

  async function handleLogout() {
    setLogoutError("");
    try {
      await onLogout();
      setLoginModalOpen(true);
    } catch (error) {
      console.log("No se pudo cerrar la sesión:", error);
      setLogoutError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  async function handleAddPerson(event) {
    event.preventDefault();
    const normalizedName = name.trim();
    const selectedNumber = Number(number);

    if (!normalizedName) {
      setMessage("Escribe el nombre del personaje.");
      return;
    }
    if (!Number.isInteger(selectedNumber) || selectedNumber < 0 || selectedNumber > 99) {
      setMessage("El número debe estar entre 00 y 99.");
      return;
    }
    if (dataStatus !== "ready") {
      setMessage("Los datos del sorteo aún no están disponibles. Inténtalo de nuevo en un momento.");
      return;
    }

    try {
      await addPerson({ name: normalizedName, number: selectedNumber });
      setName("");
      setNumber("");
      setMessage(`${normalizedName} quedó inscrito con el número ${selectedNumber}.`);
    } catch (error) {
      console.error("No se pudo inscribir al jugador:", error);
      setMessage(error.message || "No se pudo guardar la inscripción en Firebase.");
    }
  }

  async function handleClearDraw() {
    if (!authenticated || people.length === 0) return;
    if (!window.confirm("¿Seguro que quieres limpiar el sorteo? Se eliminarán todos los jugadores inscritos.")) {
      return;
    }

    try {
      await clearDraw();
      setMessage("Sorteo limpiado. Ya puedes iniciar uno nuevo.");
    } catch (error) {
      console.error("No se pudo limpiar el sorteo:", error);
      setMessage(error.message || "No se pudo limpiar el sorteo en Firebase.");
    }
  }

  async function handleTicketPriceChange(value) {
    try {
      await updateTicketPrice(Number(value));
      setMessage("Precio actualizado.");
    } catch (error) {
      console.error("No se pudo actualizar el precio del puesto:", error);
      setMessage(error.message || "No se pudo actualizar el precio en Firebase.");
    }
  }

  return (
    <>
      <main className="app-shell">
        <SiteHeader
          authenticated={authenticated}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
        />
        {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
        <HeroSection peopleCount={people.length} />

        <div className="content-grid">
          <div className="list-stack">
            <PreviousResult onResultChange={setLotteryResult} />
            <Winner lotteryResult={lotteryResult} people={people} />
            <PeopleSection
              authenticated={authenticated}
              onClearDraw={handleClearDraw}
              people={people}
            />
          </div>

          <aside className="side-stack">
            <Accumulated peopleCount={people.length} ticketPrice={ticketPrice} />
            {authenticated ? (
              <RegistrationForm
                dataError={dataError}
                dataStatus={dataStatus}
                message={message}
                name={name}
                number={number}
                onTicketPriceChange={handleTicketPriceChange}
                onNameChange={setName}
                onNumberChange={setNumber}
                onSubmit={handleAddPerson}
                peopleCount={people.length}
                ticketPrice={ticketPrice}
              />
            ) : (
              <AdminPanel dataError={dataError} dataStatus={dataStatus} ticketPrice={ticketPrice} />
            )}
          </aside>
        </div>
        <p className="footer-note">Sorteo comunitario para jugadores de Dofus. ¡Que Jiva te bendiga con la suerte necesaria!</p>
        <p className="footer-note2">© 2026 todos los derechos reservados. Yerba</p>
      </main>
      {!authenticated && loginModalOpen && (
        <LoginModal
          onContinueAsGuest={() => setLoginModalOpen(false)}
          onLogin={onLogin}
        />
      )}
      {(authenticated || !loginModalOpen) && winner && dismissedWinnerKey !== winnerKey && (
        <WinnerPopup
          onClose={() => setDismissedWinnerKey(winnerKey)}
          winner={winner}
          winningNumber={winningNumber}
          prize={winnerPrize}
        />
      )}
    </>
  );
}

export default HomePage;
