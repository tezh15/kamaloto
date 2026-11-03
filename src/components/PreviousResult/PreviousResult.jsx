import React, { useEffect, useState } from "react";
import "./PreviousResult.scss";

const RESULTS_API_URL = "https://api-resultadosloterias.com/api/results";

function formatGameDate(value) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error("La respuesta no contiene una fecha de resultado válida.");
  }
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(value));
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

    async function loadResult() {
      if (requestInFlight || disposed) return;
      requestInFlight = true;
      const controller = new AbortController();
      activeController = controller;
      const timeoutId = window.setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(RESULTS_API_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`La API respondió con estado ${response.status}.`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload.data)) {
          throw new Error("La API no devolvió una lista de resultados.");
        }

        const valle = payload.data.find((item) => item?.slug === "valle");
        if (!valle) {
          hasLoadedResult = true;
          lastResult = null;
          setResult(null);
          onResultChange({ status: "loaded", result: null });
          setStatus("loaded");
          return;
        }
        if (typeof valle.result !== "string" || !/^\d{2,}$/.test(valle.result)) {
          throw new Error("El resultado de la Lotería del Valle no tiene un formato válido.");
        }

        const nextResult = {
          winningNumber: valle.result.slice(-2),
          date: formatGameDate(valle.date),
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
        console.error("No se pudo cargar el resultado de la Lotería del Valle:", error);
        if (!hasLoadedResult) {
          onResultChange({ status: "error", result: null });
        } else {
          onResultChange({ status: "loaded", result: lastResult });
        }
        setStatus("error");
      } finally {
        window.clearTimeout(timeoutId);
        if (activeController === controller) activeController = null;
        requestInFlight = false;
      }
    }

    loadResult();
    const refreshInterval = window.setInterval(loadResult, 15 * 60 * 1000);
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") loadResult();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      activeController?.abort();
      window.clearInterval(refreshInterval);
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
