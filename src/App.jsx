import { Provider } from 'react-redux';
import { store } from './store';
import Routes from "./Routes";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { ClockProvider } from "./contexts/ClockContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <ClockProvider>
        <AuthProvider>
          <Routes />
          <PWAInstallPrompt />
        </AuthProvider>
      </ClockProvider>
    </Provider>
  );
}

export default App;
