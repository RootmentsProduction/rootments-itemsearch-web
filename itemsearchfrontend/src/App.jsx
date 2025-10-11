import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import ItemSearch from './pages/ItemSearch';
import { getSession } from './utils/session';

function App() {
  const [session, setSession] = useState(getSession());
  const navigate = useNavigate();

  useEffect(() => {
    const storedSession = getSession();

    // ✅ Auto login redirect if session exists
    if (storedSession && window.location.pathname === '/') {
      navigate('/item-search', { replace: true });
    }

    setSession(storedSession); // refresh session state
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={session ? <Navigate to="/item-search" /> : <Login onLoginSuccess={() => setSession(getSession())} />}
      />
      <Route
        path="/item-search"
        element={session ? <ItemSearch /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;




// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import Login from './pages/Login';
// import ItemSearch from './pages/ItemSearch';
// import { getSession } from './utils/session';

// function App() {
//   const [session, setSession] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedSession = getSession();
//     setSession(storedSession);

//     const target = localStorage.getItem('postLogin');
//     if (target && storedSession) {
//       localStorage.removeItem('postLogin');
//       navigate(target, { replace: true });
//     }

//     if (localStorage.getItem('needsReload')) {
//       localStorage.removeItem('needsReload');
//       window.location.reload();
//     }
//   }, [navigate]);

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={<Login onLoginSuccess={() => setSession(getSession())} />}
//       />
//       <Route
//         path="/item-search"
//         element={session ? <ItemSearch /> : <Navigate to="/" />}
//       />
//       <Route
//         path="/item"
//         element={<Navigate to="/item-search" />}
//       />
//     </Routes>
//   );
// }

// export default App;



