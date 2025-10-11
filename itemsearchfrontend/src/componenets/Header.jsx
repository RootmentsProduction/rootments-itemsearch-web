// import React from 'react';
// import { Navbar, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { getSession } from '../utils/session';
// import { FaUserCircle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const Header = () => {
//   const session = getSession();
//   const name = session?.employeeName || 'Employee';
//   const navigate = useNavigate();

//   const handleProfileClick = () => {
//     navigate('/');
//   };

//   return (
//     <Navbar bg="success" variant="dark" className="py-3 shadow-sm">
//       <Container className="d-flex justify-content-between align-items-center">
//         <Navbar.Brand className="fw-bold fs-4">Rootments</Navbar.Brand>

//         <OverlayTrigger
//           placement="bottom"
//           overlay={<Tooltip id="profile-tooltip">{name}</Tooltip>}
//         >
//           <div
//             onClick={handleProfileClick}
//             style={{
//               cursor: 'pointer',
//               color: 'white',
//               fontSize: '1.8rem',
//               transition: '0.2s',
//             }}
//             title="Go to Login"
//           >
//             <FaUserCircle />
//           </div>
//         </OverlayTrigger>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;

import React from 'react';
import { Navbar, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getSession } from '../utils/session';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const session = getSession();
  const name = session?.employeeName || 'Employee';
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const confirmLogout = window.confirm('Do you want to logout?');
    if (confirmLogout) {
      localStorage.clear();         // Clear session
      navigate('/');           // ✅ Use React Router navigation
    }
  };

  return (
    <Navbar bg="success" variant="dark" className="py-3 shadow-sm">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand className="fw-bold fs-4">Rootments</Navbar.Brand>

        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="profile-tooltip">Logout: {name}</Tooltip>}
        >
          <div
            onClick={handleProfileClick}
            style={{
              cursor: 'pointer',
              color: 'white',
              fontSize: '1.8rem',
              transition: '0.2s',
            }}
            title="Logout"
          >
            <FaUserCircle />
          </div>
        </OverlayTrigger>
      </Container>
    </Navbar>
  );
};

export default Header;
