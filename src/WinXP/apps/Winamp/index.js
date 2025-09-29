import React, { useEffect, useRef } from "react";
import Webamp from "webamp";
import { initialTracks } from "./config";

export default function Winamp({ onClose, onMinimize }) {
  const containerRef = useRef(null);
  const webampRef = useRef(null);
  const didInit = useRef(false);

  // Create & render once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || didInit.current) return;
    didInit.current = true;

    const wa = new Webamp({ initialTracks });
    webampRef.current = wa;

    // Render directly into our container (don't move the DOM afterwards)
    wa.renderWhenReady(container);

    return () => {
      try {
        webampRef.current?.dispose?.();
      } catch (_) {
        // ignore if already disposed
      } finally {
        webampRef.current = null;
        if (container) container.innerHTML = "";
      }
    };
  }, []);

  // Attach handlers (safe to run when props change)
  useEffect(() => {
    const wa = webampRef.current;
    if (!wa) return;
    if (onClose) wa.onClose(onClose);
    if (onMinimize) wa.onMinimize(onMinimize);
  }, [onClose, onMinimize]);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0 }}
    />
  );
}
