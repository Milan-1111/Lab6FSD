import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [permission, setPermission] = useState(Notification.permission);
  const [product, setProduct] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Capture the install prompt event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event to trigger later
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Handle "Install App" button click
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the browser's install prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed the PWA');
      }
      setDeferredPrompt(null); // Can only use the prompt once
    }
  };

  // Request push notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications.');
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h1>🛍️ PWA Deal Alerts</h1>

      {/* --- INSTALL APP PROMPT --- */}
      {deferredPrompt && (
        <div
          style={{
            padding: '15px',
            background: '#e0f7fa',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <p>Get the best experience by installing our app!</p>
          <button
            onClick={handleInstallClick}
            style={{
              padding: '10px',
              background: '#00838f',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Install App
          </button>
        </div>
      )}

      {/* --- PUSH NOTIFICATION PERMISSION --- */}
      <div
        style={{
          padding: '15px',
          background: '#f4f4f4',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <p>
          <strong>Push Permission Status:</strong> {permission}
        </p>

        {permission !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            style={{
              padding: '10px',
              background: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Enable Background Alerts
          </button>
        )}
      </div>
    </div>
  );
}

export default App;