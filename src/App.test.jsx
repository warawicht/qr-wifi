import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { formatWifiString } from './utils/wifiFormatter';

// Mock the QRCode component to make testing easier
jest.mock('react-qr-code', () => {
  return ({ value, id }) => <div data-testid="qr-code" id={id}>{value}</div>;
});

// Mock the wifiFormatter to simulate an error
jest.mock('./utils/wifiFormatter', () => ({
  formatWifiString: jest.fn()
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders WiFi QR Code Generator title', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    expect(screen.getByText('WiFi QR Code Generator')).toBeInTheDocument();
  });

  test('renders WiFi form initially', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    expect(screen.getByLabelText('Network Name (SSID):')).toBeInTheDocument();
    expect(screen.getByLabelText('Security Type:')).toBeInTheDocument();
  });

  test('shows error message when SSID is missing', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const generateButton = screen.getByText('Generate QR Code');
    
    // Enter an SSID to enable the button
    fireEvent.change(ssidInput, { target: { value: 'TestNetwork' } });
    expect(generateButton).not.toBeDisabled();
    
    // Clear the SSID to disable the button again
    fireEvent.change(ssidInput, { target: { value: '' } });
    expect(generateButton).toBeDisabled();
  });

  test('generates QR code when form is submitted with valid data', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByText('Scan to Connect')).toBeInTheDocument();
  });

  test('resets to form when generate another button is clicked', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.click(generateButton);
    
    // Now we should see the QR code display
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    
    // Click the reset button
    const resetButton = screen.getByText('Generate Another');
    fireEvent.click(resetButton);
    
    // Now we should see the form again
    expect(screen.getByLabelText('Network Name (SSID):')).toBeInTheDocument();
  });

  test('handles different security types', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const securitySelect = screen.getByLabelText('Security Type:');
    const passwordInput = screen.getByLabelText('Password:');
    const generateButton = screen.getByText('Generate QR Code');
    
    // Test WPA
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(securitySelect, { target: { value: 'WPA' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('WIFI:T:WPA;S:MyNetwork;P:MyPassword;;');
    
    // Reset and test WEP
    const resetButton = screen.getByText('Generate Another');
    fireEvent.click(resetButton);
    
    // Need to re-get the elements after reset
    const ssidInput2 = screen.getByLabelText('Network Name (SSID):');
    const securitySelect2 = screen.getByLabelText('Security Type:');
    const passwordInput2 = screen.getByLabelText('Password:');
    const generateButton2 = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput2, { target: { value: 'MyNetwork' } });
    fireEvent.change(securitySelect2, { target: { value: 'WEP' } });
    fireEvent.change(passwordInput2, { target: { value: 'MyPassword' } });
    fireEvent.click(generateButton2);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('WIFI:T:WEP;S:MyNetwork;P:MyPassword;;');
  });

  test('handles hidden network flag', () => {
    formatWifiString.mockImplementation((data) => {
      let result = `WIFI:T:${data.security || 'WPA'};S:${data.ssid};`;
      if (data.security !== 'nopass') {
        result += `P:${data.password || ''};`;
      }
      if (data.hidden) {
        result += 'H:true;';
      }
      result += ';';
      return result;
    });
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const hiddenCheckbox = screen.getByLabelText('Hidden Network');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.click(hiddenCheckbox);
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:true;;');
  });

  test('handles open network (no password)', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const securitySelect = screen.getByLabelText('Security Type:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'OpenNetwork' } });
    fireEvent.change(securitySelect, { target: { value: 'nopass' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByTestId('qr-code')).toHaveTextContent('WIFI:T:nopass;S:OpenNetwork;P:;;');
  });

  test('handles password visibility toggle', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const toggleButton = screen.getByText('Show');
    const passwordInput = screen.getByLabelText('Password:');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows error message when formatWifiString throws an error', () => {
    formatWifiString.mockImplementation(() => {
      throw new Error('Test error message');
    });
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByText('Error: Test error message')).toBeInTheDocument();
  });

  test('handles special characters in SSID and password', () => {
    formatWifiString.mockImplementation((data) => `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`);
    render(<App />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'My;Network:\\' } });
    fireEvent.change(passwordInput, { target: { value: 'My;Password:\\' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
  });
});