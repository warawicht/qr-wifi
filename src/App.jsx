import React, { useState } from 'react';
import WiFiForm from './components/WiFiForm';
import QRDisplay from './components/QRDisplay';
import { formatWifiString } from './utils/wifiFormatter';
import './App.css';

function App() {
  const [wifiString, setWifiString] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = (wifiData) => {
    try {
      const formattedString = formatWifiString(wifiData);
      setWifiString(formattedString);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    setWifiString('');
    setError('');
  };

  return (
    <div className="app">
      <header>
        <h1>WiFi QR Code Generator</h1>
        <p>Generate a QR code for your WiFi network to easily share credentials</p>
      </header>

      <main>
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {wifiString ? (
          <QRDisplay wifiString={wifiString} onReset={handleReset} />
        ) : (
          <WiFiForm onGenerate={handleGenerate} />
        )}
      </main>

      <footer>
        <p>Scan the QR code with your mobile device to connect to the WiFi network</p>
      </footer>
    </div>
  );
}

export default App;