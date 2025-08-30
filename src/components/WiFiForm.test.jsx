import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WiFiForm from './WiFiForm';

describe('WiFiForm', () => {
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    mockOnGenerate.mockClear();
  });

  test('renders form elements correctly', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    expect(screen.getByLabelText('Network Name (SSID):')).toBeInTheDocument();
    expect(screen.getByLabelText('Security Type:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Generate QR Code')).toBeInTheDocument();
  });

  test('calls onGenerate with correct data when form is submitted', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const passwordInput = screen.getByLabelText('Password:');
    const securitySelect = screen.getByLabelText('Security Type:');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.change(passwordInput, { target: { value: 'MyPassword' } });
    fireEvent.change(securitySelect, { target: { value: 'WPA' } });
    fireEvent.click(generateButton);
    
    expect(mockOnGenerate).toHaveBeenCalledWith({
      ssid: 'MyNetwork',
      password: 'MyPassword',
      security: 'WPA',
      hidden: false
    });
  });

  test('hides password field for open networks', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const securitySelect = screen.getByLabelText('Security Type:');
    fireEvent.change(securitySelect, { target: { value: 'nopass' } });
    
    expect(screen.queryByLabelText('Password:')).not.toBeInTheDocument();
  });

  test('shows password field for WPA networks', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const securitySelect = screen.getByLabelText('Security Type:');
    fireEvent.change(securitySelect, { target: { value: 'WPA' } });
    
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  test('shows password field for WEP networks', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const securitySelect = screen.getByLabelText('Security Type:');
    fireEvent.change(securitySelect, { target: { value: 'WEP' } });
    
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const toggleButton = screen.getByText('Show');
    const passwordInput = screen.getByLabelText('Password:');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('handles hidden network checkbox', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const hiddenCheckbox = screen.getByLabelText('Hidden Network');
    const generateButton = screen.getByText('Generate QR Code');
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    fireEvent.click(hiddenCheckbox);
    fireEvent.click(generateButton);
    
    expect(mockOnGenerate).toHaveBeenCalledWith({
      ssid: 'MyNetwork',
      password: '',
      security: 'WPA',
      hidden: true
    });
  });

  test('disables generate button when SSID is empty', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const generateButton = screen.getByText('Generate QR Code');
    expect(generateButton).toBeDisabled();
  });

  test('enables generate button when SSID is provided', () => {
    render(<WiFiForm onGenerate={mockOnGenerate} />);
    
    const ssidInput = screen.getByLabelText('Network Name (SSID):');
    const generateButton = screen.getByText('Generate QR Code');
    
    fireEvent.change(ssidInput, { target: { value: 'MyNetwork' } });
    expect(generateButton).not.toBeDisabled();
  });
});