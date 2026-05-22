import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@components/ui/Button/Button';
import { formatPrice } from '@utils/formatPrice';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) {
      removeItem(index);
      return;
    }
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const removeItem = (index: number) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    toast.success('Removed from cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FaShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products"><Button variant="primary">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({itemCount} items)</h1>
      
      <div className="space-y-4">
        {cartItems.map((item, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.title} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.brand}</p>
              <p className="font-bold mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(i, item.quantity - 1)} className="px-3 py-1 border rounded">-</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(i, item.quantity + 1)} className="px-3 py-1 border rounded">+</button>
            </div>
            <p className="font-bold w-24 text-right">{formatPrice(item.price * item.quantity)}</p>
            <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6 text-right">
        <p className="text-lg">Subtotal ({itemCount} items): <span className="font-bold">{formatPrice(subtotal)}</span></p>
        <Button variant="primary" size="lg" className="mt-4" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
      </div>
    </div>
  );
};

export default Cart;