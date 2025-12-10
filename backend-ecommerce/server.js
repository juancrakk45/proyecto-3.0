import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import connectDB from './db.js';
import User from './models/User.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

connectDB(); // Conecta a MongoDB

// Middleware
app.use(cors());
app.use(express.json());

// Productos (siguen igual)
let products = [ /* tu array de productos actual */ ];

// ===== AUTH ENDPOINTS =====

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email, name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Usuario registrado', token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email y password son requeridos' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login exitoso', token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ===== PRODUCTS ENDPOINTS =====
app.get('/api/products', (req, res) => res.json({ products }));

// ===== AUTH TOKEN =====
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.get('/api/auth/me', authenticateToken, (req, res) => res.json({ user: req.user }));

app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));
