import React, { useState, useMemo } from 'react';
import { Truck, Shield, RotateCcw } from 'lucide-react';
import AuthProvider from './context/AuthContext';
import CartProvider, { useCart } from './context/CartContext';
import Header from './components/Header';
import Filters from './components/Filters';
import ProductsGrid from './components/ProductsGrid';
import ProductDetail from './components/ProductDetail';
import CartSidebar from './components/CartSidebar';
import Checkout from './components/Checkout';
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
		reviews: 324,
		image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
		category: 'Electronics',
		description: 'Premium wireless headphones with active noise cancellation and 30-hour battery',
	},
	{
		id: 2,
		name: 'Organic Cotton T-Shirt',
		price: 24.99,
		originalPrice: 39.99,
		rating: 4.8,
		reviews: 512,
		image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
		category: 'Clothing',
		description: '100% organic cotton t-shirt, eco-friendly and sustainable',
	},
	{
		id: 3,
		name: 'Smart Fitness Watch',
		price: 199.99,
		originalPrice: 299.99,
		rating: 4.3,
		reviews: 287,
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
		category: 'Electronics',
		description: 'Advanced fitness tracking with heart rate, sleep monitoring and GPS',
	},
	{
		id: 4,
		name: 'Ceramic Coffee Mug Set',
		price: 34.99,
		originalPrice: 49.99,
		rating: 4.7,
		reviews: 198,
		image: 'https://images.unsplash.com/photo-1666713711218-8ea7743c8ed1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2VyYW1pYyUyMENvZmZlZSUyME11ZyUyMFNldHxlbnwwfHwwfHx8MA%3D%3D',
		category: 'Home',
		description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe',
	},
	{
		id: 5,
		name: 'Leather Wallet',
		price: 45.99,
		originalPrice: 79.99,
		rating: 4.6,
		reviews: 421,
		image: 'https://images.unsplash.com/photo-1601592996763-f05c9c80a7f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVhdGhlciUyMFdhbGxldHxlbnwwfHwwfHx8MA%3D%3D',
		category: 'Accessories',
		description: 'Premium genuine leather wallet with RFID protection and multiple compartments',
	},
	{
		id: 6,
		name: 'Bamboo Cutting Board',
		price: 29.99,
		originalPrice: 39.99,
		rating: 4.4,
		reviews: 156,
		image: 'https://plus.unsplash.com/premium_photo-1716922971151-420e94caccfc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QmFtYm9vJTIwQ3V0dGluZyUyMEJvYXJkfGVufDB8fDB8fHww',
		category: 'Home',
		description: 'Sustainable bamboo cutting board with juice groove and antimicrobial coating',
	},
	{
		id: 7,
		name: 'Stainless Steel Water Bottle',
		price: 35.99,
		originalPrice: 59.99,
		rating: 4.7,
		reviews: 389,
		image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3RhaW5sZXNzJTIwU3RlZWwlMjBXYXRlciUyMEJvdHRsZXxlbnwwfHwwfHx8MA%3D%3D',
		category: 'Accessories',
		description: 'Insulated stainless steel bottle keeps drinks hot/cold for 24 hours',
	},
	{
		id: 8,
		name: 'Wireless Mouse',
		price: 29.99,
		originalPrice: 49.99,
		rating: 4.4,
		reviews: 234,
		image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
		category: 'Electronics',
		description: 'Ergonomic wireless mouse with precision tracking and 18-month battery life',
	},
	{
		id: 9,
		name: 'Denim Jacket',
		price: 89.99,
		originalPrice: 149.99,
		rating: 4.6,
		reviews: 267,
		image: 'https://images.unsplash.com/photo-1537465978529-d23b17165b3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGVuaW0lMjBKYWNrZXR8ZW58MHx8MHx8fDA%3D',
		category: 'Clothing',
		description: 'Classic blue denim jacket, durable and timeless style for any season',
	},
	{
		id: 10,
		name: 'Yoga Mat',
		price: 44.99,
		originalPrice: 74.99,
		rating: 4.5,
		reviews: 312,
		image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
		category: 'Home',
		description: 'Non-slip yoga mat with alignment markers, perfect for home workouts',
	},
	{
		id: 11,
		name: 'Portable Phone Charger',
		price: 39.99,
		originalPrice: 69.99,
		rating: 4.8,
		reviews: 478,
		image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
		category: 'Electronics',
		description: '20000mAh portable power bank with fast charging for all devices',
	},
	{
		id: 12,
		name: 'Canvas Backpack',
		price: 59.99,
		originalPrice: 99.99,
		rating: 4.5,
		reviews: 291,
		image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
		category: 'Accessories',
		description: 'Durable canvas backpack with laptop compartment and USB charging port',
	},
	{
		id: 13,
		name: 'Running Shoes',
		price: 119.99,
		originalPrice: 179.99,
		rating: 4.7,
		reviews: 398,
		image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
		category: 'Clothing',
		description: 'Lightweight running shoes with cushioning and breathable mesh',
	},
	{
		id: 14,
		name: 'Desk Lamp',
		price: 54.99,
		originalPrice: 84.99,
		rating: 4.6,
		reviews: 167,
		image: 'https://plus.unsplash.com/premium_photo-1685287731216-a7a0fae7a41a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RGVzayUyMExhbXB8ZW58MHx8MHx8fDA%3D',
		category: 'Home',
		description: 'LED desk lamp with adjustable brightness and color temperature',
	},
	{
		id: 15,
		name: 'Mechanical Keyboard',
		price: 129.99,
		originalPrice: 189.99,
		rating: 4.8,
		reviews: 445,
		image: 'https://plus.unsplash.com/premium_photo-1664194583917-b0ba07c4ce2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWVjaGFuaWNhbCUyMEtleWJvYXJkfGVufDB8fDB8fHww',
		category: 'Electronics',
		description: 'Premium mechanical keyboard with RGB lighting and aluminum frame',
	},
	{
		id: 16,
		name: 'Plant Pot Set',
		price: 49.99,
		originalPrice: 79.99,
		rating: 4.4,
		reviews: 198,
		image: 'https://images.unsplash.com/photo-1701271040533-59a76ac4e887?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFBsYW50JTIwUG90JTIwU2V0fGVufDB8fDB8fHww',
		category: 'Home',
		description: 'Set of 3 ceramic plant pots with drainage holes and saucers',
	},
	{
		id: 17,
		name: 'Sunglasses',
		price: 99.99,
		originalPrice: 159.99,
		rating: 4.5,
		reviews: 256,
		image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
		category: 'Accessories',
		description: 'UV protection sunglasses with polarized lenses and stylish design',
	},
	{
		id: 18,
		name: 'Bluetooth Speaker',
		price: 74.99,
		originalPrice: 119.99,
		rating: 4.6,
		reviews: 367,
		image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
		category: 'Electronics',
		description: '360° surround sound waterproof speaker with 12-hour battery',
	},
	{
		id: 19,
		name: 'Winter Scarf',
		price: 34.99,
		originalPrice: 54.99,
		rating: 4.7,
		reviews: 203,
		image: 'https://plus.unsplash.com/premium_photo-1673286712645-9600beaa4a92?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2ludGVyJTIwU2NhcmZ8ZW58MHx8MHx8fDA%3D',
		category: 'Clothing',
		description: 'Soft merino wool scarf, warm and breathable for cold weather',
	},
	{
		id: 20,
		name: 'Webcam HD',
		price: 64.99,
		originalPrice: 99.99,
		rating: 4.5,
		reviews: 289,
		image: 'https://images.unsplash.com/photo-1626581795188-8efb9a00eeec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V2ViY2FtJTIwSER8ZW58MHx8MHx8fDA%3D',
		category: 'Electronics',
		description: '1080p HD webcam with automatic light correction and noise cancellation',
	},
	{
		id: 21,
		name: 'Face Moisturizer',
		price: 44.99,
		originalPrice: 74.99,
		rating: 4.8,
		reviews: 412,
		image: 'https://images.unsplash.com/photo-1629051192954-55d807199226?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZSUyME1vaXN0dXJpemVyfGVufDB8fDB8fHww',
		category: 'Accessories',
		description: 'Organic face moisturizer with natural ingredients, hypoallergenic formula',
	},
	{
		id: 22,
		name: 'Coffee Maker',
		price: 84.99,
		originalPrice: 134.99,
		rating: 4.6,
		reviews: 234,
		image: 'https://images.unsplash.com/photo-1608354580875-30bd4168b351?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q29mZmVlJTIwTWFrZXJ8ZW58MHx8MHx8fDA%3D',
		category: 'Home',
		description: 'Programmable coffee maker with thermal carafe and brew strength control',
	},
	{
		id: 23,
		name: 'Smartwatch Band',
		price: 19.99,
		originalPrice: 29.99,
		rating: 4.4,
		reviews: 145,
		image: 'https://images.unsplash.com/photo-1626194062394-022cc80f6d2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U21hcnR3YXRjaCUyMEJhbmR8ZW58MHx8MHx8fDA%3D',
		category: 'Accessories',
		description: 'Replacement smartwatch band, comfortable silicone material',
	},
	{
		id: 24,
		name: 'Bed Pillow Set',
		price: 69.99,
		originalPrice: 109.99,
		rating: 4.7,
		reviews: 321,
		image: 'https://media.istockphoto.com/id/1472381503/es/foto/conjunto-con-almohadas-suaves-y-mantas-sobre-fondo-blanco.webp?a=1&b=1&s=612x612&w=0&k=20&c=o7yGkelQLo4ewn-QJP-W_LLw-Y6pQ8xQva-naErwjYo=',
		category: 'Home',
		description: 'Set of 2 memory foam pillows with hypoallergenic cover',
	},
];

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Accessories'];

function AppContent() {
	const [products] = useState(mockProducts);
	const { cart, addToCart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [checkoutOpen, setCheckoutOpen] = useState(false);
	const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
	const [selectedProduct, setSelectedProduct] = useState(null);

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

	// Scroll helper para enlaces del header/footer
	const scrollToId = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
		<section id="hero" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-4">
						Shop the Latest Trends
					</h1>
					<p className="text-xl md:text-2xl mb-8 opacity-90">
						Discover amazing products at unbeatable prices
					</p>
					<button
						type="button"
						className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
						onClick={() => { setSearchTerm(''); setSelectedCategory('All'); scrollToId('products'); }}
					>
						Shop Now
					</button>
				</div>
			</section>

			{/* Categories Filter -> componente */}
		<section id="categories">
			<Filters
				categories={categories}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>
		</section>

		{/* Products Grid -> componente */}
		<section id="products">
			<ProductsGrid 
				products={filteredProducts} 
				addToCart={addToCart}
				onProductClick={setSelectedProduct}
			/>
		</section>

		{/* Features Section (se mantiene aquí) */}
		<section id="features" className="py-16 bg-gray-100">
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

		{/* Product Detail Modal */}
		<ProductDetail
			product={selectedProduct}
			isOpen={!!selectedProduct}
			onClose={() => setSelectedProduct(null)}
		/>

		{/* Shopping Cart Sidebar -> componente */}
		<CartSidebar
			cartOpen={cartOpen}
			setCartOpen={setCartOpen}
			cart={cart}
			updateQuantity={updateQuantity}
			removeFromCart={removeFromCart}
			getTotalItems={getTotalItems}
			getTotalPrice={getTotalPrice}
			onCheckout={() => setCheckoutOpen(true)}
		/>

		{/* Checkout Modal -> componente */}
		<Checkout
			isOpen={checkoutOpen}
			onClose={() => setCheckoutOpen(false)}
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
		<footer id="footer" className="bg-gray-900 text-white py-12">
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
										href="#hero"
										onClick={(e) => { e.preventDefault(); scrollToId('hero'); }}
										className="hover:text-white"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#products"
										onClick={(e) => { e.preventDefault(); scrollToId('products'); }}
										className="hover:text-white"
									>
										Products
									</a>
								</li>
								<li>
									<a
										href="#features"
										onClick={(e) => { e.preventDefault(); scrollToId('features'); }}
										className="hover:text-white"
									>
										About
									</a>
								</li>
								<li>
									<a
										href="#footer"
										onClick={(e) => { e.preventDefault(); scrollToId('footer'); }}
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
										href="#products"
										onClick={(e) => { e.preventDefault(); setSearchTerm(''); setSelectedCategory('Electronics'); scrollToId('products'); }}
										className="hover:text-white cursor-pointer"
									>
										Electronics
									</a>
								</li>
								<li>
									<a
										href="#products"
										onClick={(e) => { e.preventDefault(); setSearchTerm(''); setSelectedCategory('Clothing'); scrollToId('products'); }}
										className="hover:text-white cursor-pointer"
									>
										Clothing
									</a>
								</li>
								<li>
									<a
										href="#products"
										onClick={(e) => { e.preventDefault(); setSearchTerm(''); setSelectedCategory('Home'); scrollToId('products'); }}
										className="hover:text-white cursor-pointer"
									>
										Home
									</a>
								</li>
								<li>
									<a
										href="#products"
										onClick={(e) => { e.preventDefault(); setSearchTerm(''); setSelectedCategory('Accessories'); scrollToId('products'); }}
										className="hover:text-white cursor-pointer"
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
			<CartProvider>
				<AppContent />
			</CartProvider>
		</AuthProvider>
	);
}
