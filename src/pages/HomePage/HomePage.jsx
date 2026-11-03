import React, { useEffect, useState } from "react";
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

const STORAGE_KEY = "kamaloto.people.v1";
const PRICE_STORAGE_KEY = "kamaloto.ticket-price.v1";
const DEFAULT_TICKET_PRICE = 500000;
const TICKET_PRICES = [500000, 1000000];

function readTicketPrice() {
  try {
    const saved = window.localStorage.getItem(PRICE_STORAGE_KEY);
    if (!saved) return DEFAULT_TICKET_PRICE;
    const parsed = JSON.parse(saved);
    return TICKET_PRICES.includes(parsed) ? parsed : DEFAULT_TICKET_PRICE;
  } catch (error) {
    console.error("No se pudo leer el precio del puesto:", error);
    return DEFAULT_TICKET_PRICE;
  }
}

function readPeople() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      throw new Error("El formato guardado no es válido.");
    }

    return parsed.filter(
      (person) =>
        person &&
        typeof person.name === "string" &&
        Number.isInteger(person.number) &&
        person.number >= 0 &&
        person.number <= 99,
    );
  } catch (error) {
    console.error("No se pudo leer la lista guardada:", error);
    return [];
  }
}

function HomePage({ authenticated, onLogin, onLogout }) {
  const [people, setPeople] = useState(readPeople);
  const [ticketPrice, setTicketPrice] = useState(readTicketPrice);
  const [lotteryResult, setLotteryResult] = useState({ status: "loading", result: null });
  const [dismissedWinnerKey, setDismissedWinnerKey] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(!authenticated);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [storageError, setStorageError] = useState("");
  const winningNumber = lotteryResult.result?.winningNumber;
  const winner = winningNumber
    ? people.find((person) => person.number === Number(winningNumber))
    : null;
  const winnerKey = lotteryResult.result?.drawId || "";
  const totalPrize = people.length * ticketPrice;
  const winnerPrize = totalPrize - Math.floor(totalPrize * 0.1);

  function handleLogout() {
    onLogout();
    setLoginModalOpen(true);
  }

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
      window.localStorage.setItem(PRICE_STORAGE_KEY, JSON.stringify(ticketPrice));
      setStorageError("");
    } catch (error) {
      console.error("No se pudieron guardar los datos del sorteo:", error);
      setStorageError("No se pudieron guardar los cambios en este navegador.");
    }
  }, [people, ticketPrice]);

  function handleAddPerson(event) {
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
    if (people.some((person) => person.number === selectedNumber)) {
      setMessage(`El número ${selectedNumber} ya está registrado.`);
      return;
    }

    setPeople((current) => [...current, { name: normalizedName, number: selectedNumber }]);
    setName("");
    setNumber("");
    setMessage(`${normalizedName} quedó inscrito con el número ${selectedNumber}.`);
  }

  function handleClearDraw() {
    if (!authenticated || people.length === 0) return;
    if (!window.confirm("¿Seguro que quieres limpiar el sorteo? Se eliminarán todos los jugadores inscritos.")) {
      return;
    }

    setPeople([]);
    setMessage("Sorteo limpiado. Ya puedes iniciar uno nuevo.");
  }

  return (
    <>
      <main className="app-shell">
        <SiteHeader
          authenticated={authenticated}
          onLoginClick={() => setLoginModalOpen(true)}
          onLogout={handleLogout}
        />
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
                message={message}
                name={name}
                number={number}
                onTicketPriceChange={(value) => setTicketPrice(Number(value))}
                onNameChange={setName}
                onNumberChange={setNumber}
                onSubmit={handleAddPerson}
                peopleCount={people.length}
                storageError={storageError}
                ticketPrice={ticketPrice}
              />
            ) : (
              <AdminPanel ticketPrice={ticketPrice} />
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
