import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const QRScanner = ({ onScan, onClose }) => {
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [zoom, setZoom]         = useState(1);
  const [maxZoom, setMaxZoom]   = useState(1);
  const [zoomSupported, setZoomSupported] = useState(false);
  const scannerRef   = useRef(null);
  const isScanningRef = useRef(false);
  const streamRef    = useRef(null);

  // Apply zoom to the active camera track
  const applyZoom = useCallback(async (value) => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ zoom: value }] });
    } catch (e) {
      console.warn('Zoom apply failed:', e);
    }
  }, []);

  const handleZoomChange = (e) => {
    const value = parseFloat(e.target.value);
    setZoom(value);
    applyZoom(value);
  };

  const startScanning = useCallback(async () => {
    try {
      // Include all common barcode formats + QR code
      const formats = [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
        Html5QrcodeSupportedFormats.PDF_417,
      ];

      scannerRef.current = new Html5Qrcode("reader", { formatsToSupport: formats });
      isScanningRef.current = true;

      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 300, height: 150 } },
        (decodedText) => {
          if (isScanningRef.current && scannerRef.current) {
            scannerRef.current.stop().then(() => {
              scannerRef.current?.clear();
              isScanningRef.current = false;
              onScan(decodedText);
            }).catch(() => {
              scannerRef.current?.clear();
              isScanningRef.current = false;
              onScan(decodedText);
            });
          }
        },
        () => {} // ignore per-frame errors
      );

      setLoading(false);

      // Grab the live stream to check zoom capability
      const videoEl = document.querySelector('#reader video');
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject;
        streamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        if (track) {
          const caps = track.getCapabilities?.();
          if (caps?.zoom) {
            setZoomSupported(true);
            setMaxZoom(caps.zoom.max || 5);
            setZoom(caps.zoom.min || 1);
          }
        }
      }
    } catch (err) {
      console.error("Scanner error:", err);
      setError('Failed to start camera. Please ensure you granted camera permissions.');
      setLoading(false);
      isScanningRef.current = false;
    }
  }, [onScan]);

  // Retry grabbing stream after a short delay (some browsers need time)
  useEffect(() => {
    if (!loading && !zoomSupported) {
      const timer = setTimeout(() => {
        const videoEl = document.querySelector('#reader video');
        if (videoEl && videoEl.srcObject) {
          const stream = videoEl.srcObject;
          streamRef.current = stream;
          const track = stream.getVideoTracks()[0];
          if (track) {
            const caps = track.getCapabilities?.();
            if (caps?.zoom) {
              setZoomSupported(true);
              setMaxZoom(caps.zoom.max || 5);
              setZoom(caps.zoom.min || 1);
            }
          }
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, zoomSupported]);

  const handleModalEntered = () => {
    setTimeout(() => startScanning(), 50);
  };

  const handleClose = () => {
    if (isScanningRef.current && scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
      }).catch(() => {
        scannerRef.current?.clear();
      });
    }
    isScanningRef.current = false;
    onClose();
  };

  return (
    <Modal show centered size="md" onHide={handleClose} backdrop="static" onEntered={handleModalEntered}>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="text-success fw-bold">
          <i className="fa-solid fa-barcode me-2"></i>Scan Code
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
              <div
                className="p-5 position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
                style={{ zIndex: 10 }}
              >
                <Spinner animation="border" variant="success" className="mb-3" />
                <p className="text-muted fw-medium">Starting camera...</p>
              </div>
            )}

            <div id="reader" style={{ width: '100%', minHeight: '400px' }} />

            {/* Zoom slider — only shown when device supports it */}
            {zoomSupported && !loading && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '85%',
                  background: 'rgba(0,0,0,0.55)',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  zIndex: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Zoom out icon */}
                <i className="fa-solid fa-magnifying-glass-minus" style={{ color: '#fff', fontSize: '14px', flexShrink: 0 }} />

                <input
                  type="range"
                  min={1}
                  max={maxZoom}
                  step={0.1}
                  value={zoom}
                  onChange={handleZoomChange}
                  style={{
                    flex: 1,
                    accentColor: '#22c55e',
                    cursor: 'pointer',
                    height: '4px',
                  }}
                  aria-label="Camera zoom"
                />

                {/* Zoom in icon */}
                <i className="fa-solid fa-magnifying-glass-plus" style={{ color: '#fff', fontSize: '14px', flexShrink: 0 }} />

                {/* Zoom level badge */}
                <span
                  style={{
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    minWidth: '32px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {zoom.toFixed(1)}×
                </span>
              </div>
            )}
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
