import React, { createContext, useContext, useState, ReactNode } from 'react';
import SweetAlert, { AlertButton, AlertOptions } from '../components/SweetAlert';

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = (opts: AlertOptions) => {
    setOptions(opts);
    setVisible(true);
  };

  const handleButtonPress = (button: AlertButton) => {
    setVisible(false);
    button.onPress?.();
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <SweetAlert visible={visible} options={options} onButtonPress={handleButtonPress} />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
