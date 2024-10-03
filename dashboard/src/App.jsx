import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Register, Registry, Login, List, CreateAccount } from "./pages";
import { Navbar } from './layout';
import { useAuth } from './utils/authProvider';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: "flex" }}>
      {
        isAuthenticated ? <Navbar /> : <></>
      }
      <Routes>
        <Route>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/registrar" element={isAuthenticated ? <Register /> : <Navigate to="/login" replace />} />
          <Route path="/listado" element={isAuthenticated ? <List /> : <Navigate to="/login" replace />} />
          {/* <Route path="/registro" element={isAuthenticated ? <Registry /> : <Navigate to="/login" replace />} /> */}
        </Route>
        <Route path="/register" element={!isAuthenticated ? <CreateAccount /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
