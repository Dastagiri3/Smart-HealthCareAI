import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, User, Activity } from 'lucide-react';
import { useState } from 'react';
import { logOut } from '../firebase';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-800">MediGreen</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium">Home</Link>
            <Link to="/departments" className="text-gray-600 hover:text-green-600 font-medium">Departments</Link>
            <Link to="/doctors" className="text-gray-600 hover:text-green-600 font-medium">Doctors</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium">Admin</Link>
                )}
                <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                  <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full border border-green-200" />
                  <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-green-100 pb-4 px-4 space-y-2">
          <Link to="/" className="block py-2 text-gray-600 font-medium">Home</Link>
          <Link to="/departments" className="block py-2 text-gray-600 font-medium">Departments</Link>
          <Link to="/doctors" className="block py-2 text-gray-600 font-medium">Doctors</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block py-2 text-gray-600 font-medium">Dashboard</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-gray-600 font-medium">Admin</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block py-2 text-green-600 font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
