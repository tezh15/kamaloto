import React, { useEffect, useState } from "react";
import "./PreviousResult.scss";

const RESULTS_API_URL = "https://api-resultadosloterias.com/api/results";
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_REQUEST_ATTEMPTS = 3;

function parseGameDate(value) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error("La respuesta no contiene una fecha de resultado válida.");
  }
  const date = new Date(value);
  return {
    display: new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
      year: "numeric",
    }).format(date),
  };
}

function PreviousResult({ onResultChange }) {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let disposed = false;
    let requestInFlight = false;
    let hasLoadedResult = false;
    let lastResult = null;
    let activeController = null;
    let refreshInterval = null;

    async function fetchResults() {
      for (let attempt = 0; attempt < MAX_REQUEST_ATTEMPTS; attempt += 1) {
        if (disposed) return null;

        const controller = new AbortController();
        activeController = controller;
        const timeoutId = window.setTimeout(
          () => controller.abort(),
          REQUEST_TIMEOUT_MS,
        );
        let response;

        try {
          response = await fetch(RESULTS_API_URL, { signal: controller.signal });
        } catch (error) {
          if (disposed) return null;
          if (attempt === MAX_REQUEST_ATTEMPTS - 1) throw error;
        } finally {
          window.clearTimeout(timeoutId);
          if (activeController === controller) activeController = null;
        }

        if (response?.ok) return response;
        if (response && response.status < 500) {
          throw new Error(`La API respondió con estado ${response.status}.`);
        }
        if (attempt === MAX_REQUEST_ATTEMPTS - 1) {
          throw new Error(
            response
              ? `La API respondió con estado ${response.status} después de varios intentos.`
              : "La API no respondió después de varios intentos.",
          );
        }
        await new Promise((resolve) => window.setTimeout(resolve, 1000 * (attempt + 1)));
      }

      return null;
    }

    async function loadResult() {
      if (requestInFlight || disposed) return;
      requestInFlight = true;

      try {
        const response = await fetchResults();
        if (!response || disposed) return;

        const payload = await response.json();
        if (!Array.isArray(payload?.data)) {
          throw new Error("La API no devolvió una lista de resultados.");
        }

        const valle = payload.data.find((item) => item?.lottery === "VALLE");
        if (!valle) {
          hasLoadedResult = true;
          lastResult = null;
          setResult(null);
          onResultChange({ status: "loaded", result: null });
          setStatus("loaded");
          return;
        }
        const gameDate = parseGameDate(valle.date);
        if (typeof valle.result !== "string" || !/^\d{2,}$/.test(valle.result)) {
          throw new Error("El resultado de la Lotería del Valle no tiene un formato válido.");
        }

        const nextResult = {
          winningNumber: valle.result.slice(-2),
          date: gameDate.display,
          drawId: `${valle.date}-${valle.result}`,
          series: valle.series,
        };
        hasLoadedResult = true;
        lastResult = nextResult;
        setResult(nextResult);
        onResultChange({ status: "loaded", result: nextResult });
        setStatus("loaded");
      } catch (error) {
        if (disposed) return;
        console.log("No se pudo cargar el resultado de la Lotería del Valle:", error);
        if (!hasLoadedResult) {
          onResultChange({ status: "error", result: null });
        } else {
          onResultChange({ status: "loaded", result: lastResult });
        }
        setStatus("error");
      } finally {
        requestInFlight = false;
      }
    }

    loadResult();
    refreshInterval = window.setInterval(loadResult, 15 * 60 * 1000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") loadResult();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      activeController?.abort();
      if (refreshInterval !== null) window.clearInterval(refreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onResultChange]);

  return (
    <section aria-labelledby="result-title" className="panel result-panel">
      <p className="eyebrow"><span className="eyebrow-dot" /> Número ganador</p>
      <h2 id="result-title">Lotería del Valle</h2>
      <p className="result-schedule">Juega cada miércoles</p>
      {status === "loading" && <p className="result-note">Consultando el resultado…</p>}
      {status === "error" && (
        <div className="result-fallback" role="status">
          <p className="result-note result-error">
            La API de resultados ha fallado. El resto de la plataforma sigue disponible.
          </p>
          <a
            className="result-fallback-link"
            href={RESULTS_API_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Consultar fuente de resultados <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
      
      {status === "loaded" && (result ? (
        <div className="winning-result">
          <p className="result-date">
            {result.date}{result.series && result.series !== "null" ? ` · Serie ${result.series}` : ""}
          </p>
          <div aria-label={`Número ganador ${result.winningNumber}`} className="winning-number">
            {result.winningNumber}
          </div>
          <p className="winning-caption">Últimas dos cifras del resultado</p>
        </div>
      ) : (
        <p className="result-note">Todavía no hay resultado de la Lotería del Valle disponible.</p>
      ))}
      <p className="result-source">Datos de api-resultadosloterias.com</p>
    </section>
  );
}

export default PreviousResult;
