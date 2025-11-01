// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { loginEmployee } from '../utils/api'; // Make sure this sends employeeId & password
// import { useNavigate } from 'react-router-dom';
// import './Login.css'; // Importing animations and styles

// const Login = () => {
//   const [employeeId, setEmployeeId] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await loginEmployee(employeeId, password); // Updated call

//       if (res.data.status === "success") {
//         const data = res.data.data;

//         // Save required session data
//         localStorage.setItem('employeeId', data.employeeId);
//         localStorage.setItem('employeeName', data.name);
//         localStorage.setItem('employeeRole', data.role);
//         localStorage.setItem('storeName', data.Store); // Note: 'Store' capital S

//         // Navigate to item search page
//         navigate('/item-search');
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="login-bg d-flex align-items-center justify-content-center min-vh-100">
//       <Row className="w-100 justify-content-center">
//         <Col xs={11} sm={8} md={6} lg={4}>
//           <Card className="glass-card animate-fade-in border-0 rounded-4 shadow-lg">
//             <Card.Body className="p-4">
//               <h3 className="text-center text-success fw-bold mb-4">Employee Login</h3>
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold">Employee ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter your Employee ID"
//                     value={employeeId}
//                     onChange={(e) => setEmployeeId(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-4">
//                   <Form.Label className="fw-semibold">Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Enter your Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <div className="d-grid">
//                   <Button
//                     type="submit"
//                     variant="success"
//                     className="login-button"
//                     disabled={loading}
//                   >
//                     {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//             <Card.Footer className="text-center small text-muted py-3">
//               Access restricted to registered employees only
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;



// import React, { useState } from 'react';
// import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { loginEmployee } from '../utils/api';
// import { useNavigate } from 'react-router-dom';
// import { saveSession } from '../utils/session';
// import './Login.css';

// const Login = ({ onLoginSuccess }) => {
//   const [employeeId, setEmployeeId] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await loginEmployee(employeeId, password);

//       if (res.data.status === 'success') {
//         const data = res.data.data;

//         saveSession(data); // ✅ Save session JSON correctly
//         localStorage.setItem('storeName', data.Store); // Capital 'Store'
//         localStorage.setItem('postLogin', '/item-search'); // optional

//         onLoginSuccess?.(); // trigger session update in App
//         navigate('/item-search');
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container fluid className="login-bg d-flex align-items-center justify-content-center min-vh-100">
//       <Row className="w-100 justify-content-center">
//         <Col xs={11} sm={8} md={6} lg={4}>
//           <Card className="glass-card animate-fade-in border-0 rounded-4 shadow-lg">
//             <Card.Body className="p-4">
//               <h3 className="text-center text-success fw-bold mb-4">Employee Login</h3>
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form onSubmit={handleLogin}>
//                 <Form.Group className="mb-3">
//                   <Form.Label className="fw-semibold">Employee ID</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter your Employee ID"
//                     value={employeeId}
//                     onChange={(e) => setEmployeeId(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-4">
//                   <Form.Label className="fw-semibold">Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     placeholder="Enter your Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <div className="d-grid">
//                   <Button type="submit" variant="success" disabled={loading}>
//                     {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//             <Card.Footer className="text-center small text-muted py-3">
//               Access restricted to registered employees only
//             </Card.Footer>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;



// ✅ Login.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { loginEmployee } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { saveSession } from '../utils/session';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginEmployee(employeeId, password);

      if (res.data.status === 'success') {
        const data = res.data.data;
        console.log('📊 Login Success - Data received:', data);
        console.log('📋 Keys in data:', Object.keys(data || {}));
        
        saveSession(data);
        localStorage.setItem('storeName', data.Store);
        localStorage.setItem('employeeId', data.EmployeeId || employeeId);
        localStorage.setItem('employeeName', data.Name || data.EmployeeName || 'Unknown');
        localStorage.setItem('postLogin', '/item-search');
        
        console.log('✅ Saved to localStorage:', {
          employeeId: localStorage.getItem('employeeId'),
          employeeName: localStorage.getItem('employeeName'),
          storeName: localStorage.getItem('storeName')
        });
        
        onLoginSuccess?.();
        navigate('/item-search');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
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
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="success" disabled={loading}>
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
