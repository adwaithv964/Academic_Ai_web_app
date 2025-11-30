import React from "react";
import Routes from "./Routes";

import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { ClockProvider } from "./contexts/ClockContext";

function App() {
  return (
    <ClockProvider>
      <Routes />
      <PWAInstallPrompt />
    </ClockProvider>
  );
}

export default App;
