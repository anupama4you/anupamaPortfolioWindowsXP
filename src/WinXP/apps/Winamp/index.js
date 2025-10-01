import React, { useEffect, useRef } from "react";
import Webamp from "webamp"; // npm i webamp
import { initialTracks } from "./config";

export default function Winamp({ onClose, onMinimize }) {
  const containerRef = useRef(null);
  const webampRef = useRef(null);
  const didInit = useRef(false);

  // Mount once and render Webamp
  useEffect(() => {
    // Guard for SSR and duplicate inits (React 18 StrictMode)
    if (didInit.current) return;
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    didInit.current = true;

    const wa = new Webamp({
      initialTracks,
      // You can add skins here if you have them:
      // initialSkin: { url: "/skins/WinampClassic.wsz" },
    });
    webampRef.current = wa;

    // Render into our container (do not move/remove this node manually)
    wa.renderWhenReady(container).catch(() => {
      // In case rendering fails, allow another init attempt (optional)
      didInit.current = false;
      webampRef.current = null;
    });

    return () => {
      try {
        // Dispose if not already disposed
        webampRef.current?.dispose?.();
      } catch {
        // ignore
      } finally {
        webampRef.current = null;
        // Clear container just in case
        if (container) container.innerHTML = "";
        didInit.current = false;
      }
    };
  }, []);

  // (Re)attach external handlers when props change
  useEffect(() => {
    const wa = webampRef.current;
    if (!wa) return;

    // Clear previous listeners by re-registering on change
    if (onClose) wa.onClose(onClose);
    if (onMinimize) wa.onMinimize(onMinimize);
  }, [onClose, onMinimize]);

  return (
    <div
      ref={containerRef}
      // Full-viewport host; tweak to taste
      style={{ position: "fixed", inset: 0, pointerEvents: "auto" }}
    />
  );
}
