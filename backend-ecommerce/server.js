import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'tu-clave-secreta-cambiar-en-produccion';

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
let users = [];
let products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 128,
    image: 'https://placehold.co/300x300/4f46e5/ffffff?text=Headphones',
    category: 'Electronics',
    description: 'Premium wireless headphones with noise cancellation'
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
    description: 'Comfortable organic cotton t-shirt, eco-friendly'
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
    description: 'Advanced fitness tracking with heart rate monitoring'
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
    description: 'Set of 4 elegant ceramic mugs, dishwasher safe'
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
    description: 'Genuine leather wallet with multiple card slots'
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
    description: 'Sustainable bamboo cutting board with juice groove'
  }
];

// ===== AUTH ENDPOINTS =====

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'El usuario ya existe' });
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = { id: Date.now(), name, email, password: hashedPassword };
  users.push(user);

  const token = jwt.sign({ id: user.id, email, name }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ 
    message: 'Usuario registrado', 
    token, 
    user: { id: user.id, name, email } 
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const isValidPassword = await bcryptjs.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ 
    message: 'Login exitoso', 
    token, 
    user: { id: user.id, name: user.name, email } 
  });
});

// ===== PRODUCTS ENDPOINTS =====

app.get('/api/products', (req, res) => {
  res.json({ products });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend corriendo correctamente' });
});

// ===== MIDDLEWARE =====

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
