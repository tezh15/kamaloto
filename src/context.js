import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, runTransaction } from "@firebase/firestore";
import { db } from "./firebase";

const AppContext = createContext(null);
const DRAW_DOCUMENT = doc(db, "draws", "current");
const DEFAULT_TICKET_PRICE = 500000;
const TICKET_PRICES = [500000, 1000000];

function readDraw(data) {
  if (!Array.isArray(data.people) || !TICKET_PRICES.includes(data.ticketPrice)) {
    throw new Error("Los datos del sorteo guardados en Firebase no tienen un formato válido.");
  }

  const people = data.people.map((person) => {
    if (
      !person ||
      typeof person.name !== "string" ||
      !Number.isInteger(person.number) ||
      person.number < 0 ||
      person.number > 99
    ) {
      throw new Error("La lista de jugadores guardada en Firebase no tiene un formato válido.");
    }
    return { name: person.name, number: person.number };
  });

  return { people, ticketPrice: data.ticketPrice };
}

function readDrawFromTransaction(snapshot) {
  return snapshot.exists()
    ? readDraw(snapshot.data())
    : { people: [], ticketPrice: DEFAULT_TICKET_PRICE };
}

export function AppProvider({ children }) {
  const [people, setPeople] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(DEFAULT_TICKET_PRICE);
  const [dataStatus, setDataStatus] = useState("loading");
  const [dataError, setDataError] = useState("");

  useEffect(() => onSnapshot(
    DRAW_DOCUMENT,
    (snapshot) => {
      try {
        const draw = snapshot.exists()
          ? readDraw(snapshot.data())
          : { people: [], ticketPrice: DEFAULT_TICKET_PRICE };
        setPeople(draw.people);
        setTicketPrice(draw.ticketPrice);
        setDataError("");
        setDataStatus("ready");
      } catch (error) {
        console.error("Los datos del sorteo de Firebase no son válidos:", error);
        setDataError(error.message);
        setDataStatus("error");
      }
    },
    (error) => {
      console.error("No se pudieron cargar los datos de Firebase:", error);
      setDataError(error.message);
      setDataStatus("error");
    },
  ), []);

  async function addPerson(person) {
    if (dataStatus !== "ready") {
      throw new Error("Espera a que se carguen los datos del sorteo e inténtalo de nuevo.");
    }

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(DRAW_DOCUMENT);
      const draw = readDrawFromTransaction(snapshot);
      if (draw.people.length >= 100) {
        throw new Error("El sorteo ya está completo.");
      }
      if (draw.people.some((current) => current.number === person.number)) {
        throw new Error(`El número ${person.number} ya está registrado.`);
      }

      transaction.set(DRAW_DOCUMENT, {
        people: [...draw.people, person],
        ticketPrice: draw.ticketPrice,
      });
    });
  }

  async function clearDraw() {
    if (dataStatus !== "ready") {
      throw new Error("Espera a que se carguen los datos del sorteo e inténtalo de nuevo.");
    }

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(DRAW_DOCUMENT);
      const draw = readDrawFromTransaction(snapshot);
      transaction.set(DRAW_DOCUMENT, { people: [], ticketPrice: draw.ticketPrice });
    });
  }

  async function updateTicketPrice(price) {
    if (!TICKET_PRICES.includes(price)) {
      throw new Error("El precio seleccionado no es válido.");
    }
    if (dataStatus !== "ready") {
      throw new Error("Espera a que se carguen los datos del sorteo e inténtalo de nuevo.");
    }

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(DRAW_DOCUMENT);
      const draw = readDrawFromTransaction(snapshot);
      transaction.set(DRAW_DOCUMENT, { ...draw, ticketPrice: price });
    });
  }

  return (
    <AppContext.Provider
      value={{
        people,
        ticketPrice,
        dataStatus,
        dataError,
        addPerson,
        clearDraw,
        updateTicketPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider.");
  }
  return context;
}
