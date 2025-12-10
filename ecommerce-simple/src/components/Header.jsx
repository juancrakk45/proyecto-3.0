import React from 'react';
import { ShoppingCart, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  searchTerm,
  setSearchTerm,
  isMenuOpen,
  setIsMenuOpen,
  getTotalItems,
  setCartOpen,
  onLoginClick
}) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">ShopHub</div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Products</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="ml-2 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-indigo-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={logout}
                  className="p-2 text-gray-700 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold"
              >
                Login
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="ml-2 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
