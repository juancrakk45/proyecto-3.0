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

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">
            ShopHub
          </button>

          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('hero')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Home</button>
            <button onClick={() => scrollToSection('products')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Products</button>
            <button onClick={() => scrollToSection('categories')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Categories</button>
            <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">About</button>
            <button onClick={() => scrollToSection('footer')} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</button>
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
              className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
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
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold transition-colors"
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
          <div className="md:hidden py-4 border-t space-y-2">
            <button 
              onClick={() => scrollToSection('hero')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition-colors">
              Home
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition-colors">
              Products
            </button>
            <button 
              onClick={() => scrollToSection('categories')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition-colors">
              Categories
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition-colors">
              About
            </button>
            <button 
              onClick={() => scrollToSection('footer')}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 rounded transition-colors">
              Contact
            </button>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mt-4">
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
