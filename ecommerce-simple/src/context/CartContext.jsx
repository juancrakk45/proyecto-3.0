import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'https://proyecto-3-0.onrender.com/api';

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  // Cargar carrito del servidor cuando el usuario inicia sesión
  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      // Limpiar carrito cuando no hay usuario
      setCart([]);
    }
  }, [user, token]);

  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setCart(data.items || []);
    } catch (err) {
      console.error('Error al cargar el carrito:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addToCart = useCallback(async (product) => {
    if (!user || !token) {
      console.error('Debes iniciar sesión para agregar items al carrito');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          item: { ...product, quantity: 1 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart.items);
      }
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
    }
  }, [user, token]);

  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.items);
      }
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
    }
  }, [user, token]);

  const removeFromCart = useCallback(async (productId) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.items);
      }
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
    }
  }, [user, token]);

  const clearCart = useCallback(async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error('Error al vaciar el carrito:', err);
    }
  }, [user, token]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}
