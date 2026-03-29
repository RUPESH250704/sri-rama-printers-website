import React, { useState } from 'react';
import SuccessModal from '../components/SuccessModal';

const RubberStampsOrder: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNo: '',
    type: '',
    typeOfStamp: '',
    quantity: '',
    description: ''
  });
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderData = { ...formData, serviceType: 'rubber-stamps' };
      const response = await fetch('http://localhost:5000/api/services/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (response.ok) {
        setFormData({ phoneNo: '', type: '', typeOfStamp: '', quantity: '', description: '' });
        setShowModal(true);
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Rubber Stamps Order
      </h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Phone No:
          </label>
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            TYPE:
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Type</option>
            <option value="Round seal">Round seal</option>
            <option value="Rectangular seal">Rectangular seal</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Type of Stamp:
          </label>
          <select
            name="typeOfStamp"
            value={formData.typeOfStamp}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Type of Stamp</option>
            <option value="Polymer">Polymer</option>
            <option value="Self Ink">Self Ink</option>
            <option value="Flash stamps">Flash stamps</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Quantity:
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'black';
          }}
        >
          Place Order
        </button>
      </form>
      
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Rubber stamps order placed successfully!"
      />
    </div>
  );
};

export default RubberStampsOrder;