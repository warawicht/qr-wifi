import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRDisplay from './QRDisplay';

// Mock the QRCode component to make testing easier
jest.mock('react-qr-code', () => {
  return ({ value, id }) => <div data-testid="qr-code" id={id}>{value}</div>;
});

describe('QRDisplay', () => {
  const mockOnReset = jest.fn();
  const wifiString = 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;';

  beforeEach(() => {
    mockOnReset.mockClear();
  });

  test('renders QR code with correct value', () => {
    render(<QRDisplay wifiString={wifiString} onReset={mockOnReset} />);
    
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveTextContent(wifiString);
  });

  test('renders download and reset buttons', () => {
    render(<QRDisplay wifiString={wifiString} onReset={mockOnReset} />);
    
    expect(screen.getByText('Download QR Code')).toBeInTheDocument();
    expect(screen.getByText('Generate Another')).toBeInTheDocument();
  });

  test('calls onReset when reset button is clicked', () => {
    render(<QRDisplay wifiString={wifiString} onReset={mockOnReset} />);
    
    const resetButton = screen.getByText('Generate Another');
    fireEvent.click(resetButton);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  test('renders instructions', () => {
    render(<QRDisplay wifiString={wifiString} onReset={mockOnReset} />);
    
    expect(screen.getByText('How to Connect:')).toBeInTheDocument();
    expect(screen.getByText('Open your phone\'s camera or QR code scanner')).toBeInTheDocument();
    expect(screen.getByText('Point it at the QR code above')).toBeInTheDocument();
    expect(screen.getByText('Tap the notification that appears')).toBeInTheDocument();
    expect(screen.getByText('Confirm connection to the WiFi network')).toBeInTheDocument();
  });

  test('renders different QR codes for different inputs', () => {
    const { rerender } = render(<QRDisplay wifiString={wifiString} onReset={mockOnReset} />);
    
    expect(screen.getByTestId('qr-code')).toHaveTextContent(wifiString);
    
    const newWifiString = 'WIFI:T:WEP;S:OtherNetwork;P:OtherPassword;;';
    rerender(<QRDisplay wifiString={newWifiString} onReset={mockOnReset} />);
    
    expect(screen.getByTestId('qr-code')).toHaveTextContent(newWifiString);
  });
});