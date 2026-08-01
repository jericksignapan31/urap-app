import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { UserProvider } from './context/UserContext';
import { AlertProvider } from './context/AlertContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}