import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render(
      (decodedText) => {
        // No locCode filtering here, scan all codes
        console.log("QR code scanned:", decodedText);
        scanner.clear();  // Stop scanning
        onScan(decodedText);  // Return scanned text to parent
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );
    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <Modal show centered size="lg" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-success">
          <i className="bi bi-qr-code-scan me-2"></i>Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div id="reader" style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="mt-3" />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          <i className="bi bi-x-circle me-2"></i>Close Scanner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;