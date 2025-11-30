import React from "react";
import Routes from "./Routes";

import PWAInstallPrompt from "./components/PWAInstallPrompt";

function App() {
  return (
    <>
      <Routes />
      <PWAInstallPrompt />
    </>
  );
}

export default App;
