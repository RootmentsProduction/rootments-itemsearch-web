// import React, { useState } from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Table,
//   Spinner,
//   Alert,
//   Card,
// } from 'react-bootstrap';
// import dayjs from 'dayjs';

// import { searchItem } from '../utils/api';
// import Header from '../componenets/Header';
// import QRScanner from '../componenets/QrScanner';

// // 🔁 Hardcoded storeName → locCode map
// // 🔁 Hardcoded storeName → locCode map
// const storeToLocCode = {
//   'SUITOR GUY KOTTAYAM': '9',
//   'ZORUCCI EDAPPALLY': '144',
//   'SUITORGUY TRIVANDRUM': '700',
//   'ZORUCCI KOOTAYAM': '101',


// };


// const ItemSearch = () => {
//   const storeName = localStorage.getItem('storeName');
//   const locationId = storeToLocCode[storeName] || '';

//   const [itemCode, setItemCode] = useState('');
//   const [results, setResults] = useState([]);
//   const [scannedResults, setScannedResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showQR, setShowQR] = useState(false);

//   const handleSearch = async (code = itemCode) => {
//     if (!code.trim()) {
//       setError('Please enter or scan a valid item code.');
//       setResults([]);
//       return;
//     }

//     setError('');
//     setLoading(true);
//     setResults([]);

//     try {
//       const res = await searchItem(code.trim(), locationId);
//       const data = res.data?.dataSet?.data || [];

//       if (data.length > 0) {
//         setResults(data);
//       } else {
//         setError('No records found for the scanned item in your location.');
//         setResults([]);
//       }
//     } catch (err) {
//       setError('Failed to fetch item data. Please try again.');
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQRResult = async (scannedCode) => {
//     setShowQR(false);
//     setItemCode(scannedCode);
//     setError('');
//     setResults([]);

//     try {
//       const response = await searchItem(scannedCode, locationId);

//       if (response.data?.dataSet?.data?.length > 0) {
//         setScannedResults(response.data.dataSet.data);
//       } else {
//         setScannedResults([]);
//         setError('No matching records found for scanned code.');
//       }
//     } catch (err) {
//       setError('Failed to fetch data for scanned code.');
//       setScannedResults([]);
//     }
//   };

//   const onSearchButtonClick = () => {
//     if (scannedResults.length > 0) {
//       setResults(scannedResults);
//       setError('');
//     } else if (itemCode.trim()) {
//       handleSearch(itemCode);
//     } else {
//       setError('Please enter or scan an item code first.');
//       setResults([]);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <Container fluid className="py-5 bg-light min-vh-100">
//         <Row className="justify-content-center">
//           <Col xs={11} md={10} lg={8}>
//             <Card className="shadow-lg rounded-4 border-0">
//               <Card.Body className="p-4">
//                 <h3 className="text-center mb-4 text-success fw-bold">
//                   Item Search Portal
//                 </h3>

//                 <Form className="row g-3 align-items-end">
//                   <Col xs={12} md={8}>
//                     <Form.Group controlId="itemCodeInput">
//                       <Form.Label>Item Code</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter Item Code"
//                         value={itemCode}
//                         onChange={(e) => setItemCode(e.target.value)}
//                       />
//                     </Form.Group>
//                   </Col>

//                   <Col xs={6} md={2} className="d-flex flex-column align-items-center">
//                     <Button
//                       variant="outline-success"
//                       onClick={() => setShowQR(true)}
//                       className="w-100 d-flex justify-content-center align-items-center"
//                       title="Scan QR"
//                     >
//                       <i className="fa-solid fa-qrcode me-2"></i> Scan QR
//                     </Button>
//                   </Col>

//                   <Col xs={6} md={2}>
//                     <Button
//                       variant="outline-success"
//                       onClick={onSearchButtonClick}
//                       className="w-100"
//                       disabled={loading || !itemCode.trim()}
//                     >
//                       {loading ? (
//                         <Spinner size="sm" animation="border" />
//                       ) : (
//                         'Search'
//                       )}
//                     </Button>
//                   </Col>
//                 </Form>

//                 {error && (
//                   <Alert variant="danger" className="mt-3">
//                     {error}
//                   </Alert>
//                 )}

//                 {results.length > 0 && (
//                   <div className="mt-4 table-responsive">
//                     <Table bordered hover className="text-center align-middle" responsive>
//                       <thead className="table-success">
//                         <tr>
//                           <th>#</th>
//                           <th>Delivery Date</th>
//                           <th>Booking Date</th>
//                           <th>Return Date</th>
//                           <th>Description</th>
//                           <th>Customer Name</th>
//                           <th>Phone No</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {results.map((item, index) => (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>
//                               {item.deliveryDate
//                                 ? dayjs(item.deliveryDate).format('D/MMM/YYYY')
//                                 : '-'}
//                             </td>
//                             <td>
//                               {item.bookingDate
//                                 ? dayjs(item.bookingDate).format('D/MMM/YYYY')
//                                 : '-'}
//                             </td>
//                             <td>
//                               {item.returnDate
//                                 ? dayjs(item.returnDate).format('D/MMM/YYYY')
//                                 : '-'}
//                             </td>
//                             <td>{item.description || '-'}</td>
//                             <td>{item.customerName || '-'}</td>
//                             <td>{item.phoneNo || '-'}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 )}
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {showQR && (
//           <QRScanner
//             locCode={locationId}
//             onScan={handleQRResult}
//             onClose={() => setShowQR(false)}
//           />
//         )}
//       </Container>
//     </>
//   );
// };

// export default ItemSearch;


import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Card,
} from 'react-bootstrap';
import dayjs from 'dayjs';
import { searchItem, searchItemWithFallback, saveScanActivity } from '../utils/api';
import Header from '../componenets/Header';
import QRScanner from '../componenets/QrScanner';

// 🔁 Hardcoded storeName → locCode map
const storeToLocCode = {
  'SUITOR GUY KOTTAYAM': '9',
  'ZORUCCI EDAPPALLY': '1',
  'ZORUCCI EDAPPAL': '6',
  'ZORUCCI PERINTHALMANNA': '7',
  'ZORUCCI KOTTAKKAL': '8',
  'SUITOR GUY THRISSUR': '11',
  'SUITOR GUY PERUMBAVOOR':'10',
  'SUITOR GUY PALAKKAD':'19',
  'SUITOR GUY CHAVAKKAD': '12',
  'SUITOR GUY KALPETTA': '20',
  'SUITOR GUY KANNUR': '21',
  'SUITOR GUY MANJERI': '18',
  'SUITOR GUY VATAKARA':'14',
  'SUITOR GUY PERINTHALMANNA':'16',
  'SUITOR GUY KOTTAKKAL': '17',
  'SUITOR GUY EDAPPALLY': '3',
  'SUITOR GUY EDAPPAL': '15',
  'SUITOR GUY TRIVANDRUM': '5',
  'SUITOR GUY CALICUT': '13',
  'SUITOR GUY KOZIKODE': '13',
  'SUITOR GUY MG ROAD': '23',

};

const ItemSearch = () => {
  // Normalize storeName for robust lookup
  const rawStoreName = localStorage.getItem('storeName') || '';
  const storeName = rawStoreName.trim().toUpperCase();
  // Find matching key in storeToLocCode (case-insensitive)
  const locationId = Object.keys(storeToLocCode).find(
    key => key.toUpperCase() === storeName
  ) ? storeToLocCode[
    Object.keys(storeToLocCode).find(key => key.toUpperCase() === storeName)
  ] : '';

  // Debug: log store name and locationId
  console.log('Store name from localStorage:', rawStoreName);
  console.log('Normalized store name:', storeName);
  console.log('Resolved locationId:', locationId);

  const [itemCode, setItemCode] = useState('');
  const [results, setResults] = useState([]);
  const [scannedResults, setScannedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [apiUsed, setApiUsed] = useState('');
  
  // Helper function to track scan activity
  const trackScanActivity = async (code, scanType, success = true, error = null, duration = null) => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const employeeName = localStorage.getItem('employeeName');
      const storeName = localStorage.getItem('storeName');
      
      // Validate employeeId is actually valid (not "undefined", "null", empty, etc.)
      const isValidEmployeeId = employeeId && 
                                 employeeId !== 'undefined' && 
                                 employeeId !== 'null' && 
                                 employeeId.trim() !== '';
      
      console.log('📊 Tracking scan activity:', {
        employeeId,
        employeeName,
        storeName,
        code,
        scanType,
        isValidEmployeeId
      });
      
      if (isValidEmployeeId && code) {
        try {
          await saveScanActivity({
            employeeId,
            employeeName,
            storeName,
            locationId,
            scannedCode: code,
            searchMethod: scanType, // 'manual', 'qr_code', 'barcode', etc.
            scanSuccess: success,
            error: error,
            scanDuration: duration
          });
          console.log('✅ Scan activity tracked successfully');
        } catch (saveErr) {
          console.error('⚠️ Failed to save scan activity:', saveErr.response?.data || saveErr.message);
          // Don't fail the whole search if tracking fails
        }
      } else {
        console.warn('⚠️ Skipping tracking - invalid employeeId or code:', {
          employeeId,
          code: !!code,
          isValidEmployeeId
        });
      }
    } catch (err) {
      console.error('⚠️ Failed to track scan activity:', err);
      // Don't show error to user, just log
    }
  };

  // Pass itemCode as locCode to match API expectation
  const handleSearch = async (code = itemCode, searchMethod = 'manual') => {
    if (!code.trim()) {
      setError('Please enter or scan a valid item code.');
      setResults([]);
      return;
    }

    setError('');
    setLoading(true);
    setResults([]);
    const startTime = Date.now();

    try {
      console.log('🔍 Searching for item:', code.trim());
      console.log('📍 Using locationId:', locationId);
      console.log('🌐 Using fallback search function...');
      
      const res = await searchItemWithFallback(code.trim(), locationId);
      console.log('📡 Full API response:', res);
      console.log('📊 Response data:', res.data);
      console.log('🚀 API Used:', res.data?.apiUsed);
      console.log('📋 Expected data path:', res.data?.dataSet?.data);
      
      const data = res.data?.dataSet?.data || [];
      const duration = Date.now() - startTime;

      if (data.length > 0) {
        setResults(data);
        setApiUsed(res.data?.apiUsed || '');
        console.log('✅ Found results using', res.data?.apiUsed, ':', data);
        
        // Track successful search (scan or manual)
        trackScanActivity(code.trim(), searchMethod, true, null, duration);
      } else {
        setError('No records found for the scanned item in your location.');
        setResults([]);
        setApiUsed('');
        console.log('❌ No results found from both APIs');
        
        // Track failed search
        trackScanActivity(code.trim(), searchMethod, false, 'No results found', duration);
      }
    } catch (err) {
      console.error('💥 API Error:', err);
      setError('Failed to fetch item data. Please try again.');
      setResults([]);
      
      // Track error
      trackScanActivity(code.trim(), searchMethod, false, err.message, Date.now() - startTime);
    } finally {
      setLoading(false);
    }
  };

  // Pass scannedCode as locCode to match API expectation
  const handleQRResult = async (scannedCode) => {
    setShowQR(false);
    setItemCode(scannedCode);
    setError('');
    setResults([]);
    const startTime = Date.now();

    try {
      console.log('📱 Code scanned:', scannedCode);
      console.log('📍 Using locationId:', locationId);
      
      const response = await searchItemWithFallback(scannedCode, locationId);
      console.log('🚀 QR Search API Used:', response.data?.apiUsed);

      const duration = Date.now() - startTime;

      if (response.data?.dataSet?.data?.length > 0) {
        setScannedResults(response.data.dataSet.data);
        setApiUsed(response.data?.apiUsed || '');
        console.log('✅ QR results found using', response.data?.apiUsed, ':', response.data.dataSet.data);
        
        // Track successful scan (both QR and barcode detection is automatic)
        trackScanActivity(scannedCode, 'qr_code', true, null, duration);
      } else {
        setScannedResults([]);
        setApiUsed('');
        setError('No matching records found for scanned code.');
        console.log('❌ No QR results found from both APIs');
        
        // Track failed scan
        trackScanActivity(scannedCode, 'qr_code', false, 'No results found', duration);
      }
    } catch (err) {
      console.error('💥 QR API Error:', err);
      setError('Failed to fetch data for scanned code.');
      setScannedResults([]);
      
      // Track error
      trackScanActivity(scannedCode, 'qr_code', false, err.message, Date.now() - startTime);
    }
  };

  const onSearchButtonClick = () => {
    if (scannedResults.length > 0) {
      setResults(scannedResults);
      setError('');
    } else if (itemCode.trim()) {
      handleSearch(itemCode);
    } else {
      setError('Please enter or scan an item code first.');
      setResults([]);
    }
  };

  return (
    <>
      <Header />
      <div className="min-vh-100" style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        paddingTop: '2rem',
        paddingBottom: '2rem'
      }}>
        <Container>
        <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              <Card className="border-0 shadow-lg" style={{ 
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: '2rem'
                    }}>
                      <i className="fa-solid fa-search"></i>
                    </div>
                    <h2 className="text-success fw-bold mb-2">Item Search Portal</h2>
                    <p className="text-muted mb-0">Find and track item availability across locations</p>
                  </div>

                  <div className="bg-light p-4 rounded-4 mb-4">
                <Form className="row g-3 align-items-end">
                  <Col xs={12} md={8}>
                    <Form.Group controlId="itemCodeInput">
                          <Form.Label className="fw-semibold text-dark mb-2">
                            <i className="fa-solid fa-barcode me-2 text-success"></i>Item Code
                          </Form.Label>
                      <Form.Control
                        type="text"
                            placeholder="Enter item code (e.g., 2PNP0325T347A93KF)"
                        value={itemCode}
                        onChange={(e) => setItemCode(e.target.value)}
                            className="border-2 border-success-subtle"
                            style={{ 
                              borderRadius: '12px',
                              padding: '12px 16px',
                              fontSize: '1rem'
                            }}
                      />
                    </Form.Group>
                  </Col>

                      <Col xs={6} md={2}>
                    <Button
                      variant="outline-success"
                      onClick={() => setShowQR(true)}
                          className="w-100 d-flex justify-content-center align-items-center py-3"
                          title="Scan QR Code"
                          style={{ 
                            borderRadius: '12px',
                            borderWidth: '2px',
                            fontWeight: '500'
                          }}
                        >
                          <i className="fa-solid fa-qrcode me-2"></i> 
                          <span className="d-none d-sm-inline">Scan QR</span>
                    </Button>
                  </Col>

                  <Col xs={6} md={2}>
                    <Button
                          variant="success"
                      onClick={onSearchButtonClick}
                          className="w-100 d-flex justify-content-center align-items-center py-3"
                      disabled={loading || !itemCode.trim()}
                          style={{ 
                            borderRadius: '12px',
                            fontWeight: '500',
                            background: loading ? '#6c757d' : undefined
                          }}
                    >
                      {loading ? (
                            <Spinner size="sm" className="me-2" />
                      ) : (
                            <i className="fa-solid fa-search me-2"></i>
                      )}
                          <span className="d-none d-sm-inline">Search</span>
                    </Button>
                  </Col>
                </Form>
                  </div>

                {error && (
                    <Alert variant="danger" className="mt-3 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        <i className="fa-solid fa-exclamation-triangle me-3"></i>
                        <span className="fw-medium">{error}</span>
                      </div>
                  </Alert>
                )}

                {results.length > 0 && (
                  <div className="mt-4">
                    {/* Check if any booking data exists */}
                    {results.some(item => 
                      item.deliveryDate || item.bookingDate || item.returnDate || 
                      (item.customerName && item.customerName !== '-') || 
                      (item.phoneNo && item.phoneNo !== '-')
                    ) ? (
                      // Show normal table if booking data exists
                      <div>
                        {/* Desktop Table */}
                        <div className="d-none d-lg-block table-responsive shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                          <Table className="text-center align-middle mb-0" bordered>
                            <thead style={{ 
                              background: 'linear-gradient(135deg, #28a745, #20c997)',
                              color: 'white'
                            }}>
                              <tr>
                                <th className="py-3 px-2 fw-semibold">#</th>
                                <th className="py-3 px-2 fw-semibold">Delivery Date</th>
                                <th className="py-3 px-2 fw-semibold">Booking Date</th>
                                <th className="py-3 px-2 fw-semibold">Return Date</th>
                                <th className="py-3 px-2 fw-semibold">Description</th>
                                <th className="py-3 px-2 fw-semibold">Customer Name</th>
                                <th className="py-3 px-2 fw-semibold">Phone No</th>
                                <th className="py-3 px-2 fw-semibold">Item Code</th>
                                <th className="py-3 px-2 fw-semibold">Item Name</th>
                                <th className="py-3 px-2 fw-semibold">Count</th>
                                <th className="py-3 px-2 fw-semibold">Price</th>
                                <th className="py-3 px-2 fw-semibold">Location</th>
                                <th className="py-3 px-2 fw-semibold">Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((item, index) => (
                                <tr key={index} style={{ 
                                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                  transition: 'all 0.2s ease'
                                }} 
                                className="hover-row">
                                  <td className="py-3 px-2 fw-medium text-success">{index + 1}</td>
                                  <td className="py-3 px-2">
                                    {item.deliveryDate
                                      ? dayjs(item.deliveryDate).format('D/MMM/YYYY')
                                      : <span className="text-muted">-</span>}
                                  </td>
                                  <td className="py-3 px-2">
                                    {item.bookingDate
                                      ? dayjs(item.bookingDate).format('D/MMM/YYYY')
                                      : <span className="text-muted">-</span>}
                                  </td>
                                  <td className="py-3 px-2">
                                    {item.returnDate
                                      ? dayjs(item.returnDate).format('D/MMM/YYYY')
                                      : <span className="text-muted">-</span>}
                                  </td>
                                  <td className="py-3 px-2 fw-medium">{item.description || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2">{item.customerName || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2">{item.phoneNo || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2 fw-medium text-primary">{item.itemcode || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2 fw-medium">{item.itemName || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2">
                                    <span className="badge bg-success-subtle text-success px-2 py-1">
                                      {item.itemCount || '-'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-2 fw-bold text-success">₹{item.price || '-'}</td>
                                  <td className="py-3 px-2">{item.location || <span className="text-muted">-</span>}</td>
                                  <td className="py-3 px-2">
                                    <span className="badge bg-info-subtle text-info px-2 py-1">
                                      {item.category || '-'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="d-lg-none">
                          {results.map((item, index) => (
                            <Card key={index} className="mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                              <Card.Body className="p-3">
                                <div className="row g-2">
                                  {/* Only show Description if it has data */}
                                  {item.description && item.description !== '-' && (
                                    <div className="col-12">
                                      <small className="text-muted">Description</small>
                                      <div className="fw-medium">{item.description}</div>
                                    </div>
                                  )}
                                  {(item.deliveryDate || item.bookingDate || item.returnDate || (item.customerName && item.customerName !== '-') || (item.phoneNo && item.phoneNo !== '-')) && (
                                    <>
                                      <div className="col-12 mt-2 pt-2 border-top">
                                        <small className="text-muted">Booking Details</small>
                                      </div>
                                      {item.deliveryDate && (
                                        <div className="col-6">
                                          <small className="text-muted">Delivery Date</small>
                                          <div>
                                            {dayjs(item.deliveryDate).format('D/MMM/YYYY')}
                                          </div>
                                        </div>
                                      )}
                                      {item.bookingDate && (
                                        <div className="col-6">
                                          <small className="text-muted">Booking Date</small>
                                          <div>
                                            {dayjs(item.bookingDate).format('D/MMM/YYYY')}
                                          </div>
                                        </div>
                                      )}
                                      {item.returnDate && (
                                        <div className="col-6">
                                          <small className="text-muted">Return Date</small>
                                          <div>
                                            {dayjs(item.returnDate).format('D/MMM/YYYY')}
                                          </div>
                                        </div>
                                      )}
                                      {item.customerName && item.customerName !== '-' && (
                                        <div className="col-6">
                                          <small className="text-muted">Customer Name</small>
                                          <div>{item.customerName}</div>
                                        </div>
                                      )}
                                      {item.phoneNo && item.phoneNo !== '-' && (
                                        <div className="col-12">
                                          <small className="text-muted">Phone No</small>
                                          <div>{item.phoneNo}</div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Show "No Booking Available" message if no booking data
                      <div className="mb-4">
                        <Alert variant="success" className="text-center border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                          <div className="d-flex flex-column align-items-center">
                            <div className="mb-3" style={{
                              width: '60px',
                              height: '60px',
                              background: 'linear-gradient(135deg, #28a745, #20c997)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1.5rem'
                            }}>
                              <i className="fa-solid fa-check-circle"></i>
                            </div>
                            <h5 className="text-success fw-bold mb-2">Product is Available for booking</h5>
                            <p className="text-muted mb-0">This item is currently available and ready to be booked by customers.</p>
                          </div>
                        </Alert>
                        <div>
                          {/* Desktop Table */}
                          <div className="d-none d-lg-block table-responsive shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <Table className="text-center align-middle mb-0" bordered>
                              <thead style={{ 
                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                color: 'white'
                              }}>
                                <tr>
                                  <th className="py-3 px-2 fw-semibold">#</th>
                                  <th className="py-3 px-2 fw-semibold">Delivery Date</th>
                                  <th className="py-3 px-2 fw-semibold">Booking Date</th>
                                  <th className="py-3 px-2 fw-semibold">Return Date</th>
                                  <th className="py-3 px-2 fw-semibold">Description</th>
                                  <th className="py-3 px-2 fw-semibold">Customer Name</th>
                                  <th className="py-3 px-2 fw-semibold">Phone No</th>
                                  <th className="py-3 px-2 fw-semibold">Item Code</th>
                                  <th className="py-3 px-2 fw-semibold">Item Name</th>
                                  <th className="py-3 px-2 fw-semibold">Count</th>
                                  <th className="py-3 px-2 fw-semibold">Price</th>
                                  <th className="py-3 px-2 fw-semibold">Location</th>
                                  <th className="py-3 px-2 fw-semibold">Category</th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.map((item, index) => (
                                  <tr key={index} style={{ 
                                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                                    transition: 'all 0.2s ease'
                                  }} 
                                  className="hover-row">
                                    <td className="py-3 px-2 fw-medium text-success">{index + 1}</td>
                                    <td className="py-3 px-2">
                                      {item.deliveryDate
                                        ? dayjs(item.deliveryDate).format('D/MMM/YYYY')
                                        : <span className="text-muted">-</span>}
                                    </td>
                                    <td className="py-3 px-2">
                                      {item.bookingDate
                                        ? dayjs(item.bookingDate).format('D/MMM/YYYY')
                                        : <span className="text-muted">-</span>}
                                    </td>
                                    <td className="py-3 px-2">
                                      {item.returnDate
                                        ? dayjs(item.returnDate).format('D/MMM/YYYY')
                                        : <span className="text-muted">-</span>}
                                    </td>
                                    <td className="py-3 px-2 fw-medium">{item.description || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2">{item.customerName || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2">{item.phoneNo || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2 fw-medium text-primary">{item.itemcode || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2 fw-medium">{item.itemName || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2">
                                      <span className="badge bg-success-subtle text-success px-2 py-1">
                                        {item.itemCount || '-'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-2 fw-bold text-success">₹{item.price || '-'}</td>
                                    <td className="py-3 px-2">{item.location || <span className="text-muted">-</span>}</td>
                                    <td className="py-3 px-2">
                                      <span className="badge bg-info-subtle text-info px-2 py-1">
                                        {item.category || '-'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>

                          {/* Mobile Cards */}
                          <div className="d-lg-none">
                            {results.map((item, index) => (
                              <Card key={index} className="mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                                <Card.Body className="p-3">
                                  <div className="row g-2">
                                    <div className="col-6">
                                      <small className="text-muted">Item Code</small>
                                      <div className="fw-bold text-primary">{item.itemcode || '-'}</div>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">Price</small>
                                      <div className="fw-bold text-success">₹{item.price || '-'}</div>
                                    </div>
                                    <div className="col-12">
                                      <small className="text-muted">Description</small>
                                      <div className="fw-medium">{item.description || '-'}</div>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">Count</small>
                                      <div>
                                        <span className="badge bg-success-subtle text-success px-2 py-1">
                                          {item.itemCount || '-'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">Category</small>
                                      <div>
                                        <span className="badge bg-info-subtle text-info px-2 py-1">
                                          {item.category || '-'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <small className="text-muted">Location</small>
                                      <div>{item.location || '-'}</div>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </Container>
      </div>

      {/* Custom CSS for hover effects */}
      <style jsx>{`
        .hover-row:hover {
          background-color: #e8f5e8 !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
      `}</style>

        {showQR && (
          <QRScanner
            locCode={locationId}
            onScan={handleQRResult}
            onClose={() => setShowQR(false)}
          />
        )}
    </>
  );
};

export default ItemSearch;