import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = ({ isActive }) =>
    `transition ${isActive
      ? 'text-white font-semibold border-b-2 border-white pb-0.5'
      : 'text-blue-200 hover:text-white'}`;

  return (
    <nav className="bg-linear-to-r from-blue-700 to-indigo-800 text-white px-6 py-8 flex justify-between items-center shadow">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold">Nashat Beverages ERP</h1>
        <div className="hidden md:flex gap-4 text-sm">
          <NavLink to="/" end className={navLink}>Dashboard</NavLink>
          <NavLink to="/products" className={navLink}>Products</NavLink>
          <NavLink to="/raw-materials" className={navLink}>Materials</NavLink>
          <NavLink to="/customers" className={navLink}>Customers</NavLink>
          <NavLink to="/orders" className={navLink}>Orders</NavLink>
          <NavLink to="/production" className={navLink}>Production</NavLink>
          <NavLink to="/expenses" className={navLink}>Expenses</NavLink>
          <NavLink to="/reports" className={navLink}>Reports</NavLink>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-blue-200 text-sm">Welcome, {user?.name}</span>
        <button onClick={handleLogout}
          className="bg-blue-900 px-3 py-1 rounded text-sm hover:bg-blue-800 transition">
          Logout
        </button>
      </div>
    </nav>
  );
}