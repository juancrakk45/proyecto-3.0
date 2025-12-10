import React, { useState, useMemo } from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import AuthProvider from './context/AuthContext';
import Header from './components/Header';
import Filters from './components/Filters';
import ProductsGrid from './components/ProductsGrid';
import CartSidebar from './components/CartSidebar';
import Login from './components/Login';
import Register from './components/Register';

// Mock product data
const mockProducts = [
	{
		id: 1,
		name: 'Wireless Bluetooth Headphones',
		price: 129.99,
		originalPrice: 199.99,
		rating: 4.5,
		reviews: 128,
		image: 'https://placehold.co/300x300/4f46e5/ffffff?text=Headphones',
		category: 'Electronics',
		description: 'Premium wireless headphones with noise cancellation',
	},
	{
		id: 2,
		name: 'Organic Cotton T-Shirt',
		price: 24.99,
		originalPrice: 39.99,
		rating: 4.8,
		reviews: 89,
		image: 'https://placehold.co/300x300/059669/ffffff?text=T-Shirt',
		category: 'Clothing',
		description: 'Comfortable organic cotton t-shirt, eco-friendly',
	},
	{
		id: 3,
		name: 'Smart Fitness Watch',
		price: 199.99,
		originalPrice: 299.99,
		rating: 4.3,
		reviews: 203,
		image: 'https://placehold.co/300x300/dc2626/ffffff?text=Watch',
		category: 'Electronics',
		description: 'Advanced fitness tracking with heart rate monitoring',
	},
	{
		id: 4,
		name: 'Ceramic Coffee Mug Set',
		price: 34.99,
		originalPrice: 49.99,
		rating: 4.7,
		reviews: 67,
		image: 'https://placehold.co/300x300/7c3aed/ffffff?text=Mugs',
		category: 'Home',
		description: 'Set of 4 elegant ceramic mugs, dishwasher safe',
	},
	{
		id: 5,
		name: 'Leather Wallet',
		price: 45.99,
		originalPrice: 79.99,
		rating: 4.6,
		reviews: 156,
		image: 'https://placehold.co/300x300/1f2937/ffffff?text=Wallet',
		category: 'Accessories',
		description: 'Genuine leather wallet with multiple card slots',
	},
	{
		id: 6,
		name: 'Bamboo Cutting Board',
		price: 29.99,
		originalPrice: 39.99,
		rating: 4.4,
		reviews: 92,
		image: 'https://placehold.co/300x300/047857/ffffff?text=Board',
		category: 'Home',
		description: 'Sustainable bamboo cutting board with juice groove',
	},
];

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Accessories'];

function AppContent() {
	const [products] = useState(mockProducts);
	const [cart, setCart] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null

	// Deriva productos filtrados con useMemo (evita setState en efectos y renders en cascada)
	const filteredProducts = useMemo(() => {
		let filtered = products;

		if (searchTerm) {
			const q = searchTerm.toLowerCase();
			filtered = filtered.filter(
				product =>
					product.name.toLowerCase().includes(q) ||
					product.description.toLowerCase().includes(q)
			);
		}

		if (selectedCategory !== 'All') {
			filtered = filtered.filter(
				product => product.category === selectedCategory
			);
		}

		return filtered;
	}, [products, searchTerm, selectedCategory]);

	const addToCart = product => {
		setCart(prevCart => {
			const existingItem = prevCart.find(item => item.id === product.id);
			if (existingItem) {
				return prevCart.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}
			return [...prevCart, { ...product, quantity: 1 }];
		});
	};

	const removeFromCart = productId => {
		setCart(prevCart => prevCart.filter(item => item.id !== productId));
	};

	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity === 0) {
			removeFromCart(productId);
			return;
		}
		setCart(prevCart =>
			prevCart.map(item =>
				item.id === productId ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const getTotalItems = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return cart
			.reduce((total, item) => total + item.price * item.quantity, 0)
			.toFixed(2);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				isMenuOpen={isMenuOpen}
				setIsMenuOpen={setIsMenuOpen}
				getTotalItems={getTotalItems}
				setCartOpen={setCartOpen}
				onLoginClick={() => setAuthModal('login')}
			/>

			{/* Hero Section */}
			<section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-4">
						Shop the Latest Trends
					</h1>
					<p className="text-xl md:text-2xl mb-8 opacity-90">
						Discover amazing products at unbeatable prices
					</p>
					<button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
						Shop Now
					</button>
				</div>
			</section>

			{/* Categories Filter -> componente */}
			<Filters
				categories={categories}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>

			{/* Products Grid -> componente */}
			<ProductsGrid products={filteredProducts} addToCart={addToCart} />

			{/* Features Section (se mantiene aquí) */}
			<section className="py-16 bg-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
						<div className="bg-white p-6 rounded-xl shadow-sm">
							<Truck className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
							<p className="text-gray-600">On orders over $50</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-sm">
							<Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
							<p className="text-gray-600">100% secure checkout</p>
						</div>
						<div className="bg-white p-6 rounded-xl shadow-sm">
							<RotateCcw className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
							<p className="text-gray-600">30-day return policy</p>
						</div>
					</div>
				</div>
			</section>

			{/* Shopping Cart Sidebar -> componente */}
			<CartSidebar
				cartOpen={cartOpen}
				setCartOpen={setCartOpen}
				cart={cart}
				updateQuantity={updateQuantity}
				removeFromCart={removeFromCart}
				getTotalItems={getTotalItems}
				getTotalPrice={getTotalPrice}
			/>

			{/* Auth Modales */}
			{authModal === 'login' && (
				<Login
					onSwitchToRegister={() => setAuthModal('register')}
					onClose={() => setAuthModal(null)}
				/>
			)}
			{authModal === 'register' && (
				<Register
					onSwitchToLogin={() => setAuthModal('login')}
					onClose={() => setAuthModal(null)}
				/>
			)}

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-4">ShopHub</h3>
							<p className="text-gray-400">
								Your one-stop shop for all your needs.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Quick Links</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Products
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Contact
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Categories</h4>
							<ul className="space-y-2 text-gray-400">
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Electronics
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Clothing
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-white"
									>
										Accessories
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Contact Us</h4>
							<p className="text-gray-400">Email: info@shophub.com</p>
							<p className="text-gray-400">Phone: (123) 456-7890</p>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>&copy; 2025 ShopHub. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	);
}
