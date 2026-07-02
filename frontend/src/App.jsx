import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';

function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><div className="p-8">Customers page coming soon</div></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><div className="p-8">Orders page coming soon</div></ProtectedRoute>} />
      <Route path="/production" element={<ProtectedRoute><div className="p-8">Production page coming soon</div></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><div className="p-8">Expenses page coming soon</div></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><div className="p-8">Reports page coming soon</div></ProtectedRoute>} />
    </Routes>
  );
}

export default App;