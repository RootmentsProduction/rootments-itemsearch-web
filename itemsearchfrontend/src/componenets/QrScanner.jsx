import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onScan, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });
    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        // Optionally handle scan errors
        console.warn(error);
      }
    );
    return () => scanner.clear();
  }, [onScan]);

  return (
    <Modal show centered size="lg" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-successs">
          <i className="bi bi-qr-code-scan  me-2"></i>Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          <i className="bi bi-qr-code" style={{ fontSize: '5rem', color: '#0d6efd' }}></i>
          <div id="reader" style={{ width: '100%', maxWidth: '400px' }} className="mt-3"></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          <i className="bi bi-x-circle me-2"></i>Close Scanner
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QrScanner;


