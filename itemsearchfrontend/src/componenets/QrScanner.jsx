import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  const startScanning = useCallback(async () => {
    try {
      scannerRef.current = new Html5Qrcode("reader");
      isScanningRef.current = true;
      
      // Start scanning with back camera only
      await scannerRef.current.start(
        { facingMode: "environment" }, // Back camera
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText, decodedResult) => {
          console.log("QR code scanned:", decodedText);
          if (isScanningRef.current && scannerRef.current) {
            scannerRef.current.stop().then(() => {
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
              isScanningRef.current = false;
              onScan(decodedText);
            }).catch(err => {
              console.error("Stop scanner error:", err);
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
              isScanningRef.current = false;
              onScan(decodedText);
            });
          }
        },
        (errorMessage) => {
          // Ignore scan errors, they're normal during scanning
        }
      );
      setLoading(false);
    } catch (err) {
      console.error("Scanner error:", err);
      setError('Failed to start camera. Please ensure you granted camera permissions.');
      setLoading(false);
      isScanningRef.current = false;
    }
  }, [onScan]);

  const handleModalEntered = () => {
    // Modal is now fully shown, start scanning
    setTimeout(() => {
      startScanning();
    }, 50);
  };

  const handleClose = () => {
    if (isScanningRef.current && scannerRef.current) {
      scannerRef.current.stop().then(() => {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      }).catch(err => {
        console.error("Cleanup error:", err);
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      });
    }
    isScanningRef.current = false;
    onClose();
  };

  return (
    <Modal show centered size="md" onHide={handleClose} backdrop="static" onEntered={handleModalEntered}>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-success fw-bold">
          <i className="fa-solid fa-qrcode me-2"></i>Scan QR Code
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 text-center position-relative">
        {error ? (
          <div className="p-5">
            <div className="text-danger mb-3">
              <i className="fa-solid fa-exclamation-triangle fa-4x"></i>
            </div>
            <p className="text-muted fw-medium">{error}</p>
          </div>
        ) : (
          <>
            {loading && (
              <div className="p-5 position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white" style={{ zIndex: 10 }}>
                <Spinner animation="border" variant="success" className="mb-3" />
                <p className="text-muted fw-medium">Starting camera...</p>
              </div>
            )}
            <div id="reader" style={{ width: '100%', minHeight: '400px' }} />
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="success" onClick={handleClose} className="px-5 py-2 fw-semibold">
          <i className="fa-solid fa-times me-2"></i>Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRScanner;