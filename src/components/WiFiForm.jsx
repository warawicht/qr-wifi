import React, { useState } from 'react';
import PropTypes from 'prop-types';

const WiFiForm = ({ onGenerate }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ ssid, password, security, hidden });
  };

  const isFormValid = () => {
    return ssid.trim() !== '';
  };

  return (
    <form onSubmit={handleSubmit} className="wifi-form">
      <div className="form-group">
        <label htmlFor="ssid">Network Name (SSID):</label>
        <input
          type="text"
          id="ssid"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="security">Security Type:</label>
        <select
          id="security"
          value={security}
          onChange={(e) => setSecurity(e.target.value)}
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Open Network</option>
        </select>
      </div>

      {security !== 'nopass' && (
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      )}

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />
          Hidden Network
        </label>
      </div>

      <button type="submit" disabled={!isFormValid()}>
        Generate QR Code
      </button>
    </form>
  );
};

WiFiForm.propTypes = {
  onGenerate: PropTypes.func.isRequired
};

export default WiFiForm;