import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import "./styles/global.scss";
import { AppProvider } from "./context";
import { auth } from "./firebase";
import HomePage from "./pages/HomePage/HomePage";

const ADMIN_UID = "TCksXZW37GMPS5AaKXXtlEJL1iF3";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (user) => {
        if (user && user.uid !== ADMIN_UID) {
          setAuthenticated(false);
          signOut(auth).catch((error) => {
            console.log("No se pudo cerrar la sesión de una cuenta no autorizada:", error);
          });
        } else {
          setAuthenticated(Boolean(user));
        }
        setAuthReady(true);
      },
      (error) => {
        console.log("No se pudo comprobar la sesión de Firebase:", error);
        setAuthenticated(false);
        setAuthReady(true);
      },
    );
  }, []);

  async function handleLogin(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (credential.user.uid !== ADMIN_UID) {
      throw new Error("Esta cuenta no está autorizada como organizador.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  if (!authReady) {
    return (
      <main className="app-shell">
        <p role="status">Comprobando la sesión...</p>
      </main>
    );
  }

  return (
    <AppProvider>
      <HomePage
        authenticated={authenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </AppProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
