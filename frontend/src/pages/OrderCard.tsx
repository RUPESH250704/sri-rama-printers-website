import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../types';
import { cardsAPI, ordersAPI } from '../services/api';

const OrderCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState(0);
  const [customText, setCustomText] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCard = useCallback(async () => {
    try {
      const response = await cardsAPI.getById(id!);
      setCard(response.data);
      setCustomPrice(0);
    } catch (error) {
      console.error('Error fetching card:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCard();
    }
  }, [id, fetchCard]);

  const getDisplayImages = () => {
    if (!card) return [];
    if (card.images && card.images.length > 0) {
      return card.images;
    }
    return [card.image];
  };

  const nextImage = () => {
    const images = getDisplayImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getDisplayImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    try {
      const orderData = {
        card: card._id,
        quantity,
        customPrice,
        customText,
        advanceAmount,
        totalAmount: customPrice * quantity,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
        phone
      };

      await ordersAPI.create(orderData);
      alert('Order placed successfully!');
      navigate('/my-orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (!card) return <div style={{ textAlign: 'center', padding: '2rem' }}>Card not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={`http://localhost:5000/uploads/${getDisplayImages()[currentImageIndex]}`}
            alt={card.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
          {getDisplayImages().length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                ›
              </button>
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '5px'
              }}>
                {getDisplayImages().map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div>
          <h2>{card.name}</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{card.description}</p>

          <p style={{ fontSize: '1rem', color: card.stock > 0 ? '#28a745' : '#dc3545' }}>Stock Available: {card.stock}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px' }}>
        <h3>Place Your Order</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Price per piece (₹):</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={customPrice}
            onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
          <small style={{ color: '#666' }}>Set your price per piece</small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            max={card.stock}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
          {card.stock > 0 && (
            <small style={{ color: '#666' }}>Maximum available: {card.stock}</small>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Custom Text (Optional):</label>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter any custom text for the card"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Advance Amount (₹):</label>
          <input
            type="number"
            min="0"
            max={customPrice * quantity}
            step="0.01"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(parseFloat(e.target.value) || 0)}
            onWheel={(e) => e.currentTarget.blur()}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
          <small style={{ color: '#666' }}>Enter advance payment amount</small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Delivery Option:</label>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="deliveryType"
                value="delivery"
                checked={deliveryType === 'delivery'}
                onChange={(e) => setDeliveryType(e.target.value as 'delivery')}
                style={{ marginRight: '0.5rem' }}
              />
              Home Delivery
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="deliveryType"
                value="pickup"
                checked={deliveryType === 'pickup'}
                onChange={(e) => setDeliveryType(e.target.value as 'pickup')}
                style={{ marginRight: '0.5rem' }}
              />
              Store Pickup
            </label>
          </div>
        </div>

        {deliveryType === 'delivery' && (
          <div style={{ marginBottom: '1rem' }}>
            <label>Delivery Address:</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>Total Amount: ₹{customPrice * quantity}</strong>
            </div>
            <div>
              <strong>Advance Paid: ₹{advanceAmount}</strong>
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', color: '#dc3545' }}>
            <strong>Remaining: ₹{(customPrice * quantity) - advanceAmount}</strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={card.stock === 0 || quantity > card.stock}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            backgroundColor: card.stock === 0 || quantity > card.stock ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1.1rem',
            cursor: card.stock === 0 || quantity > card.stock ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (card.stock > 0 && quantity <= card.stock) {
              e.currentTarget.style.backgroundColor = '#218838';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (card.stock > 0 && quantity <= card.stock) {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {card.stock === 0 ? 'Out of Stock' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderCard;