import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { ordersAPI } from '../services/api';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#17a2b8';
      case 'processing': return '#fd7e14';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', backgroundColor: 'white' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={`http://localhost:5000/uploads/${order.card.image}`}
                  alt={order.card.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <h4>{order.card.name}</h4>
                  <p>Quantity: {order.quantity}</p>
                  <p>Total: ₹{order.totalAmount}</p>
                  {order.advanceAmount && (
                    <>
                      <p style={{ color: '#28a745' }}>Advance Paid: ₹{order.advanceAmount}</p>
                      <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Remaining: ₹{order.totalAmount - order.advanceAmount}</p>
                    </>
                  )}
                  <p>Delivery: {order.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
                  {order.customText && <p>Custom Text: {order.customText}</p>}
                  <p>Order Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      fontSize: '0.9rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;