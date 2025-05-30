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
import { getSession } from '../utils/session';
import { searchItem } from '../utils/api';
import QRScanner from '../componenets/QrScanner';
import dayjs from 'dayjs';
import Header from '../componenets/Header';

const ItemSearch = () => {
  const session = getSession();
  const [itemCode, setItemCode] = useState('');
  const locationId = session?.locCode || ''; // Location is fixed from session
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

 const handleSearch = async () => {
  setError('');
  setLoading(true);
  setResults([]);

  try {
    const res = await searchItem(itemCode, parseInt(locationId));

    const resultsArray = res.data?.dataSet?.data || [];

    console.log('🔍 API Response:', res.data); // ✅ Add this line
    console.log('📦 Parsed Results Array:', resultsArray); // ✅ Optional: See what will be displayed

    if (resultsArray.length > 0) {
      setResults(resultsArray);
    } else {
      setError('No records found.');
    }
  } catch (err) {
    console.error('Search error:', err);
    setError('Error fetching item data.');
  } finally {
    setLoading(false);
  }
};


  const handleQRResult = (scannedCode) => {
    setItemCode(scannedCode);
    setShowQR(false);
    handleSearch();
  };

  return (
    <>
      <Header />
      <Container fluid className="py-5 bg-light min-vh-100">
        <Row  className="justify-content-center">
          <Col xs={11} md={10} lg={8}>
            <Card className="shadow-lg rounded-4 border-0">
              <Card.Body className="p-4">
                <h3 className="text-center mb-4 text-success fw-bold">
                  Item Search Portal
                </h3>

                <Form className="row g-3 align-items-end">
                  <Col xs={12} md={8}>
                    <Form.Group>
                      <Form.Label>Item Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Item Code"
                        value={itemCode}
                        onChange={(e) => setItemCode(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={6} md={2}>
                    <Button
                      variant="outline-success"
                      onClick={() => setShowQR(true)}
                      className="w-100"
                      title="Scan QR"
                    >
                      <i className="fa-solid fa-qrcode"></i>
                    </Button>
                  </Col>

                  <Col xs={6} md={2}>
                    <Button
                      variant="outline-success"
                      onClick={handleSearch}
                      className="w-100"
                      disabled={loading || !itemCode}
                      style={{
                        backgroundColor: 'transparent',
                        transition: '0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#198754';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '';
                      }}
                    >
                      {loading ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </Col>
                </Form>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}

                {results.length > 0 && (
                  <div className="mt-4 table-responsive">
                    <Table bordered hover className="text-center">
                      <thead className="table-success">
                        <tr>
                          <th>#</th>
                          <th>Delivery Date </th>
                          <th>Booking Date</th>
                          <th>Return Date</th>
                          <th>Description</th>
                          <th>Customer Name</th>
                          <th>Phone No</th>
                          
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {item.deliveryDate
                                ? dayjs(item.deliveryDate).format('D/MMM/YYYY')
                                : '-'}
                            </td>
                            <td>
                              {item.bookingDate
                                ? dayjs(item.bookingDate).format('D/MMM/YYYY')
                                : '-'}
                            </td>
                            <td>
                              {item.returnDate
                                ? dayjs(item.returnDate).format('D/MMM/YYYY')
                                : '-'}
                            </td>
                            
                            <td>{item.description || '-'}</td>
                            <td>{item.customerName || '-'}</td>
                            <td>{item.phoneNo || '-'}</td>
                            
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {showQR && (
          <QRScanner onScan={handleQRResult} onClose={() => setShowQR(false)} />
        )}
      </Container>
    </>
  );
};

export default ItemSearch;
