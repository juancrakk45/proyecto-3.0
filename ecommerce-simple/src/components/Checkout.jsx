import React, { useState } from 'react';
import { X, Truck, Lock, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Checkout({ isOpen, onClose }) {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [loading, setLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState({ total: '0.00', itemsCount: 0 });

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [shippingOption, setShippingOption] = useState('standard'); // 'standard' | 'express'
  const shippingCost = shippingOption === 'express' ? 15.0 : 0.0;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!shippingData.fullName || !shippingData.address || !shippingData.city || !shippingData.zipCode) {
        alert('Por favor completa todos los campos de envío');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!paymentData.cardName || !paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv) {
        alert('Por favor completa todos los campos de pago');
        return;
      }
      handleCompleteOrder();
    }
  };

  const handleCompleteOrder = async () => {
    setLoading(true);
    try {
      // Tomar snapshot del pedido antes de vaciar el carrito (subtotal + envío)
      const subtotal = parseFloat(getTotalPrice());
      const snapshotTotal = (subtotal + shippingCost).toFixed(2);
      const snapshotItems = cart.reduce((s, it) => s + (it.quantity || 0), 0);

      // Simulamos un retraso de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Limpiar carrito después de completar la compra
      await clearCart();

      // Guardar resumen del pedido para mostrar en la pantalla de confirmación
      setOrderSummary({ total: snapshotTotal, itemsCount: snapshotItems });
      setStep(3);
    } catch (err) {
      alert('Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    onClose();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold">Checkout</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="text-xs mt-1">Envío</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="text-xs mt-1">Pago</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="text-xs mt-1">Confirmar</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Datos de Envío</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    placeholder="Calle Principal 123"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      placeholder="Nueva York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <select
                      name="country"
                      value={shippingData.country}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                      <option>United Kingdom</option>
                      <option>Spain</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Options */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">Opciones de Envío</h4>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-indigo-600 rounded-lg bg-indigo-50 cursor-pointer">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingOption === 'standard'}
                        onChange={() => setShippingOption('standard')}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900">Envío Estándar</p>
                        <p className="text-sm text-gray-600">5-7 días hábiles</p>
                      </div>
                      <span className="text-indigo-600 font-semibold">Gratis</span>
                    </label>
                    <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-indigo-600">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingOption === 'express'}
                        onChange={() => setShippingOption('express')}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-medium text-gray-900">Envío Express</p>
                        <p className="text-sm text-gray-600">2-3 días hábiles</p>
                      </div>
                      <span className="text-gray-900 font-semibold">$15.00</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Método de Pago</h3>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                  <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Tu información de pago está protegida y segura. Tus datos nunca serán compartidos.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la Tarjeta</label>
                  <input
                    type="text"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    placeholder="JUAN PEREZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, '');
                      if (value.length <= 16) {
                        value = value.replace(/(\d{4})/g, '$1 ').trim();
                        handlePaymentChange({ target: { name: 'cardNumber', value } });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none font-mono"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vencimiento (MM/YY)</label>
                    <input
                      type="text"
                      name="expiry"
                      value={paymentData.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        handlePaymentChange({ target: { name: 'expiry', value } });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none font-mono"
                      placeholder="12/25"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          handlePaymentChange({ target: { name: 'cvv', value } });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none font-mono"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-gray-900">${getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Envío:</span>
                    <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-semibold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-xl text-indigo-600">${(parseFloat(getTotalPrice()) + shippingCost).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Compra Completada!</h3>
                <p className="text-gray-600 mb-6">Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Resumen del Pedido</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número de Pedido:</span>
                      <span className="font-mono font-semibold">#ORD-{Date.now().toString().slice(-8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cantidad de Productos:</span>
                      <span className="font-semibold">{orderSummary.itemsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-indigo-600">${orderSummary.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Envío a:</span>
                      <span className="font-semibold">{shippingData.city}, {shippingData.country}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Se ha enviado un correo de confirmación a <span className="font-semibold">{shippingData.email}</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer with Buttons */}
          <div className="border-t p-6 bg-gray-50 flex gap-4">
            {step < 3 && (
              <>
                <button
                  onClick={() => {
                    if (step === 2) setStep(1);
                    else onClose();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                >
                  {step === 2 ? 'Atrás' : 'Cancelar'}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      {step === 1 ? 'Continuar a Pago' : 'Completar Compra'}
                      {step === 2 && <CreditCard className="h-4 w-4" />}
                    </>
                  )}
                </button>
              </>
            )}
            {step === 3 && (
              <button
                onClick={handleFinish}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
              >
                Volver a la Tienda
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
