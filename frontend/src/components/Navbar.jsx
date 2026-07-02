import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">Nashat Beverages ERP</h1>
        <div className="hidden md:flex gap-4 text-sm">
          <Link to="/" className="hover:text-blue-200 transition">Dashboard</Link>
          <Link to="/products" className="hover:text-blue-200 transition">Products</Link>
          <Link to="/customers" className="hover:text-blue-200 transition">Customers</Link>
          <Link to="/orders" className="hover:text-blue-200 transition">Orders</Link>
          <Link to="/production" className="hover:text-blue-200 transition">Production</Link>
          <Link to="/expenses" className="hover:text-blue-200 transition">Expenses</Link>
          <Link to="/reports" className="hover:text-blue-200 transition">Reports</Link>
          <Link to="/raw-materials" className="hover:text-blue-200 transition">Materials</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-200 text-sm">Welcome, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-blue-900 px-3 py-1 rounded text-sm hover:bg-blue-800 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}