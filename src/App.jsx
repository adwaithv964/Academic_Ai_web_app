import { Provider } from 'react-redux';
import { store } from './store';
import Routes from "./Routes";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { ClockProvider } from "./contexts/ClockContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <Provider store={store}>
      <ClockProvider>
        <AuthProvider>
          <ThemeProvider>
            <Routes />
            <PWAInstallPrompt />
          </ThemeProvider>
        </AuthProvider>
      </ClockProvider>
    </Provider>
  );
}

export default App;
