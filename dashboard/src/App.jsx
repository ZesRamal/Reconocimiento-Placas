import { Routes, Route, Navigate } from "react-router-dom";
import { Home, Register, Registry, Login, List, CreateAccount } from "./pages";
import { Navbar } from './layout';
import ProtectedRoute from "./utils/protectedRoutes";
import PublicRoute from "./utils/publicRoutes";
import { useAuth } from './utils/authProvider';

function App() {
  const { isAuthenticated } = useAuth();

  return (
      <div style={{ display: "flex" }}>
          {isAuthenticated && <Navbar />}
          <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/registrar" element={<ProtectedRoute><Register /></ProtectedRoute>} />
              <Route path="/listado" element={<ProtectedRoute><List /></ProtectedRoute>} />
              <Route path="/registro" element={<ProtectedRoute><Registry /></ProtectedRoute>} />
              <Route path="/register" element={<PublicRoute><CreateAccount /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          </Routes>
      </div>
  );
}

export default App
