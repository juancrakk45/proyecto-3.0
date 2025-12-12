import React, { useState } from 'react';
import { X, Star, Truck, Shield, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    alert(`${product.name} añadido al carrito`);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Detalles del Producto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                      -{discountPercent}%
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Categoría: <span className="font-semibold text-indigo-600">{product.category}</span>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col">
                {/* Title and Rating */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xl text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-green-600 font-semibold">
                    {product.originalPrice > product.price ? 'En oferta' : 'Mejor precio'}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-700">Envío gratis en pedidos mayores a $50</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-700">Garantía de satisfacción de 30 días</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold transition-colors"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Agregar al Carrito
                  </button>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isWishlisted
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stock Info */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold">✓ En stock - Entrega rápida</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Especificaciones</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Categoria: {product.category}</li>
                  <li>• ID Producto: #{product.id}</li>
                  <li>• Calificación: {product.rating}★</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Envío</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Envío estándar: 5-7 días</li>
                  <li>• Envío express: 2-3 días</li>
                  <li>• Gratis para órdenes superiores a $50</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Devolución</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 30 días de garantía</li>
                  <li>• Reembolso completo</li>
                  <li>• Sin preguntas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
