import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Home, Register, Registry, Login, List, CreateAccount } from "./pages";
import { Navbar } from './layout';
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false)
    }
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Router>
        {
          isAuthenticated ? <Navbar /> : <></>
        }
        <Routes>
          <Route>
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/registrar" element={isAuthenticated ? <Register /> : <Navigate to="/login" replace />} />
            <Route path="/listado" element={isAuthenticated ? <List /> : <Navigate to="/login" replace />} />
            <Route path="/registro" element={isAuthenticated ? <Registry /> : <Navigate to="/login" replace />} />
          </Route>
          <Route path="/register" element={!isAuthenticated ? <CreateAccount /> : <Navigate to="/" replace />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
