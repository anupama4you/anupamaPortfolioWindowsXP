import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "assets/clear.css";
import "assets/font.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot && !window.frameElement) {
  console.log("HMR enabled");
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <NextApp />
      </React.StrictMode>
    );
  });
}
