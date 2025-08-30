/**
 * Format WiFi credentials according to the WiFi QR code specification
 * @param {Object} wifiData - WiFi network data
 * @param {string} wifiData.ssid - Network SSID
 * @param {string} wifiData.password - Network password
 * @param {string} wifiData.security - Security type (WPA, WEP, nopass)
 * @param {boolean} wifiData.hidden - Whether the network is hidden
 * @returns {string} Formatted WiFi string for QR code
 */
export function formatWifiString({ ssid, password, security, hidden }) {
  // Validate required parameters
  if (!ssid) {
    throw new Error('SSID is required');
  }

  // Default to WPA if no security type is provided
  const securityType = security || 'WPA';
  
  // Escape special characters in SSID and password
  const escapeSpecialChars = (str) => {
    if (!str) return str;
    return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
  };

  const escapedSsid = escapeSpecialChars(ssid);
  const escapedPassword = escapeSpecialChars(password);

  // Build the WiFi string according to the specification
  let wifiString = `WIFI:T:${securityType};S:${escapedSsid};`;
  
  // Add password if security type is not 'nopass'
  if (securityType !== 'nopass') {
    // Add password even if it's empty or null
    const passwordValue = escapedPassword || '';
    wifiString += `P:${passwordValue};`;
  }
  
  // Add hidden network flag if specified
  if (hidden) {
    wifiString += 'H:true;';
  }
  
  // Add trailing semicolon
  wifiString += ';';
  
  return wifiString;
}