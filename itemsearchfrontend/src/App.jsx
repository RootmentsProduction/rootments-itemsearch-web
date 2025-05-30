import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ItemSearch from './pages/ItemSearch';
import { getSession } from './utils/session';


function App() {
  const session = getSession();

  return (
    <Routes>
      <Route path="/" element={session ? <Navigate to="/item-search" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/item-search" element={session ? <ItemSearch /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;


