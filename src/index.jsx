import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <HomePage
      authenticated={authenticated}
      onLogin={() => setAuthenticated(true)}
      onLogout={() => setAuthenticated(false)}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
