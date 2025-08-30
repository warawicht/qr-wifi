import { formatWifiString } from './wifiFormatter';

describe('wifiFormatter', () => {
  test('formats WPA WiFi string correctly', () => {
    const wifiData = {
      ssid: 'MyNetwork',
      password: 'MyPassword',
      security: 'WPA'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');
  });

  test('formats WEP WiFi string correctly', () => {
    const wifiData = {
      ssid: 'OldNetwork',
      password: 'WepKey123',
      security: 'WEP'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WEP;S:OldNetwork;P:WepKey123;;');
  });

  test('formats open network WiFi string correctly', () => {
    const wifiData = {
      ssid: 'OpenNetwork',
      security: 'nopass'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:nopass;S:OpenNetwork;;');
  });

  test('includes hidden network flag when specified', () => {
    const wifiData = {
      ssid: 'HiddenNetwork',
      password: 'SecretPassword',
      security: 'WPA',
      hidden: true
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:HiddenNetwork;P:SecretPassword;H:true;;');
  });

  test('throws error when SSID is missing', () => {
    const wifiData = {
      password: 'MyPassword',
      security: 'WPA'
    };
    
    expect(() => formatWifiString(wifiData)).toThrow('SSID is required');
  });

  test('defaults to WPA security when not specified', () => {
    const wifiData = {
      ssid: 'MyNetwork',
      password: 'MyPassword'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');
  });

  test('escapes special characters in SSID', () => {
    const wifiData = {
      ssid: 'My;Network:\\',
      password: 'MyPassword',
      security: 'WPA'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:My\\;Network\\:\\\\;P:MyPassword;;');
  });

  test('escapes special characters in password', () => {
    const wifiData = {
      ssid: 'MyNetwork',
      password: 'My;Password:\\',
      security: 'WPA'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:My\\;Password\\:\\\\;;');
  });

  test('handles empty password for WPA network', () => {
    const wifiData = {
      ssid: 'MyNetwork',
      password: '',
      security: 'WPA'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:;;');
  });

  test('handles null password for WPA network', () => {
    const wifiData = {
      ssid: 'MyNetwork',
      password: null,
      security: 'WPA'
    };
    
    const result = formatWifiString(wifiData);
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:;;');
  });
});