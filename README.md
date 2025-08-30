# WiFi QR Code Generator

A simple web application that generates QR codes containing WiFi network credentials. When scanned with a mobile device, these QR codes will automatically connect the device to the specified WiFi network without manually entering the password.

## Features

- Generate QR codes containing WiFi SSID and password
- Support for different WiFi security types (WPA, WEP, Open)
- Simple user interface for entering network details
- QR code display for easy mobile scanning
- Download functionality for generated QR codes

## Technology Stack

- **Frontend**: React.js with Vite
- **QR Code Generation**: react-qr-code library
- **Styling**: CSS3
- **Testing**: Jest with React Testing Library
- **Deployment**: Vercel

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Testing

Run unit tests with coverage:
```bash
npm run test:coverage
```

## Building for Production

Create a production build:
```bash
npm run build
```

## Deployment

This application is configured for deployment to Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your application.

## How to Use

1. Enter your WiFi network name (SSID)
2. Select the security type (WPA/WPA2, WEP, or Open)
3. Enter the password (if applicable)
4. Optionally check "Hidden Network" if your network is not broadcasted
5. Click "Generate QR Code"
6. Scan the QR code with your mobile device to connect to the WiFi network

## License

This project is licensed under the MIT License.