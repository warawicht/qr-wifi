import React from 'react';
import QRCode from 'react-qr-code';
import PropTypes from 'prop-types';

const QRDisplay = ({ wifiString, onReset }) => {
  const downloadQRCode = () => {
    const svg = document.getElementById('wifi-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'wifi-qr-code.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className="qr-display">
      <h2>Scan to Connect</h2>
      <div className="qr-code-container">
        <QRCode
          id="wifi-qr-code"
          value={wifiString}
          size={256}
          level="M"
          includeMargin={true}
        />
      </div>
      <div className="qr-actions">
        <button onClick={downloadQRCode} className="download-button" type="button">
          Download QR Code
        </button>
        <button onClick={onReset} className="reset-button" type="button">
          Generate Another
        </button>
      </div>
      <div className="instructions">
        <h3>How to Connect:</h3>
        <ol>
          <li>Open your phone's camera or QR code scanner</li>
          <li>Point it at the QR code above</li>
          <li>Tap the notification that appears</li>
          <li>Confirm connection to the WiFi network</li>
        </ol>
      </div>
    </div>
  );
};

QRDisplay.propTypes = {
  wifiString: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired
};

export default QRDisplay;