import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../routes/Home';
import Auth from '../routes/Auth';
import Nav from './Nav';
import Profile from './Profile';

function AppRouter({ isLoggedIn, userObj }) {
  return (
    <>
      <h1>Post Board</h1>
      {isLoggedIn && <Nav />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route path="/profile" element={<Profile />} />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </>
  );
}

export default AppRouter;
