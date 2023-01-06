import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import { useAuthenticatedUser } from './providers/Authentication';
import Read from './pages/Read';
import Item from './pages/Items';
import ReadHeader from './pages/ReadHeader';
import Intro from './pages/Intro';
import Profile from './pages/Profile';
import Hyperlink from './pages/Hyperlink';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuthenticatedUser();
  const location = useLocation();

  if (isLoading) {
    return <div />;
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" state={{ next: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/read"
          element={
            <RequireAuth>
              <Read />
            </RequireAuth>
          }
        />
        <Route
          path="/read/week"
          element={
            <RequireAuth>
              <ReadHeader />
            </RequireAuth>
          }
        >
          <Route
            path=":week/:item"
            element={
              <RequireAuth>
                <Item />
              </RequireAuth>
            }
          >
            <Route path="hyperlinks/:hyperlink" element={<Hyperlink />} />
          </Route>
          <Route
            path="intro"
            element={
              <RequireAuth>
                <Intro />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/read" />} />
      </Routes>
    </>
  );
};

export default App;
