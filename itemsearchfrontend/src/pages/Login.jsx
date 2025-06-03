import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { loginEmployee } from '../utils/api';
import { saveSession } from '../utils/session';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Importing animations and styles

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const res = await loginEmployee(employeeId, email);

    if (res.data.success) {
      /* 1️⃣  keep your current save */
      saveSession(res.data.data);                                            

      /* 2️⃣  remember where we want to go after the reload            */
      localStorage.setItem('postLogin', '/item-search');

      /* 3️⃣  trigger the one-time hard refresh                        */
      window.location.reload();                                            
      /* ↓ no navigate() here – the page is being replaced */
    } else {
      setError('Invalid credentials');
    }
  } catch {
    setError('Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <Container fluid className="login-bg d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <Card className="glass-card animate-fade-in border-0 rounded-4 shadow-lg">
            <Card.Body className="p-4">
              <h3 className="text-center text-success fw-bold mb-4">Employee Login</h3>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Employee ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="success"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center small text-muted py-3">
              Access restricted to registered employees only
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
