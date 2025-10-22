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
    <Modal show centered size="md" onHide={onClose}>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="text-success">
          <i className="fa-solid fa-qrcode me-2"></i>QR Scanner
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <div id="reader" style={{ width: '100%', height: '400px' }} />
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;