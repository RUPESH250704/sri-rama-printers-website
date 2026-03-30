import React, { useState, useEffect } from 'react';
import { Card, Order } from '../types';
import { cardsAPI, ordersAPI, servicesAPI, shopsAPI } from '../services/api';
import ShopCharts from '../components/ShopCharts';

const CardWithCarousel: React.FC<{card: Card, cardImages: string[], onEdit: () => void, onDelete: () => void}> = ({ card, cardImages, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img
          src={`http://localhost:5000/uploads/${cardImages[currentImageIndex]}`}
          alt={card.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
        />
        {cardImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev - 1 + cardImages.length) % cardImages.length)}
              style={{
                position: 'absolute',
                left: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev + 1) % cardImages.length)}
              style={{
                position: 'absolute',
                right: '5px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ›
            </button>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '3px'
            }}>
              {cardImages.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{
                    width: '6px',
                    height: '6px',
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
      <h4>{card.name}</h4>
      <p>₹{card.price}</p>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>{card.description}</p>
      <p style={{ fontSize: '0.9rem', color: card.stock > 0 ? '#28a745' : '#dc3545' }}>Stock: {card.stock}</p>
      {cardImages.length > 1 && (
        <p style={{ fontSize: '0.8rem', color: '#007bff' }}>{cardImages.length} images</p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button
          onClick={onEdit}
          style={{ flex: 1, padding: '0.5rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          Modify
        </button>
        <button
          onClick={onDelete}
          style={{ flex: 1, padding: '0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'orders' | 'xerox' | 'performance' | 'attendance'>('cards');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [cards, setCards] = useState<Card[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceOrders, setServiceOrders] = useState<any[]>([]);
  const [shopReports, setShopReports] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('shop1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dateRangeType, setDateRangeType] = useState<'single' | 'range'>('single');
  const [shopFilters, setShopFilters] = useState({
    shop1: true,
    shop2: true,
    shop3: true
  });
  const [performanceFromDate, setPerformanceFromDate] = useState<string>('');
  const [performanceToDate, setPerformanceToDate] = useState<string>('');
  const [showAllCards, setShowAllCards] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCard, setNewCard] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as File[]
  });
  const [editCard, setEditCard] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    addStock: '',
    images: [] as File[]
  });

  useEffect(() => {
    fetchCards();
    fetchOrders();
    fetchServiceOrders();
    fetchShopReports();
  }, []);

  const fetchCards = async () => {
    try {
      console.log('Fetching cards...');
      const response = await cardsAPI.getAll();
      console.log('Cards API response:', response);
      
      // Handle different response formats
      let cardsData = [];
      if (response.data && Array.isArray(response.data.data)) {
        cardsData = response.data.data; // Paginated response
      } else if (Array.isArray(response.data)) {
        cardsData = response.data; // Direct array
      } else if (response.data && response.data.cards) {
        cardsData = response.data.cards; // Nested cards
      }
      
      console.log('Setting cards:', cardsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setCards([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchServiceOrders = async () => {
    try {
      const response = await servicesAPI.getAllOrders();
      setServiceOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching service orders:', error);
      setServiceOrders([]);
    }
  };

  const fetchShopReports = async () => {
    try {
      const response = await shopsAPI.getAllReports();
      setShopReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching shop reports:', error);
      setShopReports([]);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first to add cards');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', newCard.name);
    formData.append('description', newCard.description);
    formData.append('price', newCard.price);
    formData.append('category', newCard.category);
    formData.append('stock', newCard.stock);
    if (newCard.images && newCard.images.length > 0) {
      newCard.images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      const response = await cardsAPI.create(formData);
      console.log('Card created successfully:', response.data);
      alert('Card added successfully!');
      setShowAddCard(false);
      setNewCard({ name: '', description: '', price: '', category: '', stock: '', images: [] });
      fetchCards();
    } catch (error: any) {
      console.error('Error adding card:', error);
      if (error.response?.status === 401) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        alert('Admin access required. Please contact administrator.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to add card. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setEditCard({
      name: card.name,
      description: card.description,
      price: card.price.toString(),
      category: card.category,
      stock: card.stock.toString(),
      addStock: '',
      images: []
    });
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const formData = new FormData();
    formData.append('name', editCard.name);
    formData.append('description', editCard.description);
    formData.append('price', editCard.price);
    formData.append('category', editCard.category);
    
    // Calculate new stock: current stock + additional stock
    const currentStock = parseInt(editCard.stock);
    const additionalStock = parseInt(editCard.addStock) || 0;
    const newStock = currentStock + additionalStock;
    formData.append('stock', newStock.toString());
    
    if (editCard.images && editCard.images.length > 0) {
      editCard.images.forEach(image => {
        formData.append('images', image);
      });
    }

    try {
      await cardsAPI.update(editingCard._id, formData);
      setEditingCard(null);
      setEditCard({ name: '', description: '', price: '', category: '', stock: '', addStock: '', images: [] });
      fetchCards();
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await cardsAPI.delete(cardId);
        setEditingCard(null);
        fetchCards();
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Helper function to get filtered reports based on shop selection
  const getShopFilteredReports = (reports: any[]) => {
    return reports.filter(report => {
      if (report.shopId === '1' && !shopFilters.shop1) return false;
      if (report.shopId === '2' && !shopFilters.shop2) return false;
      if (report.shopId === '3' && !shopFilters.shop3) return false;
      return true;
    });
  };

  // Helper function to format date as dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to check if date range is exactly 7 days
  const isExactly7Days = () => {
    if (dateRangeType === 'range' && fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 6; // 7 days inclusive (0-6 = 7 days)
    }
    return false;
  };

  // Helper function to get date range
  const getFilteredReports = () => {
    const getReportDate = (report: any) => report.reportDate || report.createdAt;

    if (dateRangeType === 'single' && selectedDate) {
      return shopReports.filter(report => 
        new Date(getReportDate(report)).toDateString() === new Date(selectedDate).toDateString()
      );
    } else if (dateRangeType === 'range' && fromDate && toDate) {
      return shopReports.filter(report => {
        const reportDate = new Date(getReportDate(report));
        return reportDate >= new Date(fromDate) && reportDate <= new Date(toDate);
      });
    }
    return shopReports;
  };

  // Helper function to get previous week data for comparison
  const getPreviousWeekData = () => {
    if (isExactly7Days() && fromDate) {
      const currentWeekStart = new Date(fromDate);
      const prevWeekStart = new Date(currentWeekStart);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekEnd = new Date(prevWeekStart);
      prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);
      
      return shopReports.filter(report => {
        const reportDate = new Date(report.reportDate || report.createdAt);
        return reportDate >= prevWeekStart && reportDate <= prevWeekEnd;
      });
    }
    return [];
  };

  const handleUpdateServiceOrderStatus = async (orderId: string, status: string) => {
    try {
      await servicesAPI.updateStatus(orderId, status);
      fetchServiceOrders();
    } catch (error) {
      console.error('Error updating service order status:', error);
    }
  };

  const clearDateFilters = () => {
    setSelectedDate('');
    setFromDate('');
    setToDate('');
    setDateRangeType('single');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('cards')}
          style={{
            padding: '1rem 2rem',
            marginRight: '1rem',
            background: activeTab === 'cards' 
              ? 'linear-gradient(145deg, #0056b3, #007bff, #4dabf7)' 
              : 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
            color: activeTab === 'cards' ? 'white' : '#333',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: activeTab === 'cards'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            textShadow: activeTab === 'cards' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = activeTab === 'cards'
              ? '0 4px 8px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'cards'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'cards'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
        >
          Manage Cards
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '1rem 2rem',
            background: activeTab === 'orders' 
              ? 'linear-gradient(145deg, #0056b3, #007bff, #4dabf7)' 
              : 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
            color: activeTab === 'orders' ? 'white' : '#333',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: activeTab === 'orders'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            textShadow: activeTab === 'orders' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = activeTab === 'orders'
              ? '0 4px 8px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'orders'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'orders'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
        >
          Manage Orders
        </button>
        <button
          onClick={() => setActiveTab('xerox')}
          style={{
            padding: '1rem 2rem',
            marginLeft: '1rem',
            background: activeTab === 'xerox' 
              ? 'linear-gradient(145deg, #0056b3, #007bff, #4dabf7)' 
              : 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
            color: activeTab === 'xerox' ? 'white' : '#333',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: activeTab === 'xerox'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            textShadow: activeTab === 'xerox' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = activeTab === 'xerox'
              ? '0 4px 8px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'xerox'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = activeTab === 'xerox'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
          }}
        >
          XEROX
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          style={{
            padding: '1rem 2rem',
            marginLeft: '1rem',
            background: activeTab === 'performance' 
              ? 'linear-gradient(145deg, #0056b3, #007bff, #4dabf7)' 
              : 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
            color: activeTab === 'performance' ? 'white' : '#333',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: activeTab === 'performance'
              ? '0 8px 16px rgba(0, 123, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
            textShadow: activeTab === 'performance' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
        >
          Employee Performance
        </button>
        <button
          onClick={() => window.location.href = '/attendance'}
          style={{
            padding: '1rem 2rem',
            marginLeft: '1rem',
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
            color: '#333',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease'
          }}
        >
          Attendance
        </button>
      </div>

      {activeTab === 'cards' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Cards Management</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowAllCards(!showAllCards)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: showAllCards ? '#dc3545' : '#17a2b8', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  transition: 'all 0.3s ease' 
                }}
              >
                {showAllCards ? 'Hide Cards' : 'View All Cards'}
              </button>
              <button
                onClick={() => setShowAddCard(true)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#218838';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Add New Card
              </button>
            </div>
          </div>

          {showAddCard && (
            <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <h4>Add New Card</h4>
              <form onSubmit={handleAddCard}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Card Name"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newCard.category}
                    onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', minHeight: '80px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Price"
                    value={newCard.price}
                    onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Stock Quantity"
                    value={newCard.stock}
                    onChange={(e) => setNewCard({ ...newCard, stock: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewCard({ ...newCard, images: files });
                    }}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                {newCard.images.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p>Selected images: {newCard.images.length}</p>
                  </div>
                )}
                <div>
                  <button 
                    type="submit" 
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '1rem', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Add Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddCard(false)} 
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5a6268';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#6c757d';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {editingCard && (
            <div style={{ border: '1px solid #ddd', padding: '2rem', borderRadius: '8px', marginBottom: '2rem', backgroundColor: '#f8f9fa' }}>
              <h4>Edit Card</h4>
              <form onSubmit={handleUpdateCard}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Card Name"
                    value={editCard.name}
                    onChange={(e) => setEditCard({ ...editCard, name: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={editCard.category}
                    onChange={(e) => setEditCard({ ...editCard, category: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={editCard.description}
                  onChange={(e) => setEditCard({ ...editCard, description: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', minHeight: '80px' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Price"
                    value={editCard.price}
                    onChange={(e) => setEditCard({ ...editCard, price: e.target.value })}
                    required
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Current Stock"
                    value={editCard.stock}
                    readOnly
                    style={{ padding: '0.5rem', backgroundColor: '#f8f9fa' }}
                  />
                  <input
                    type="number"
                    placeholder="Add Stock"
                    value={editCard.addStock}
                    onChange={(e) => setEditCard({ ...editCard, addStock: e.target.value })}
                    style={{ padding: '0.5rem' }}
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setEditCard({ ...editCard, images: files });
                    }}
                    style={{ padding: '0.5rem' }}
                  />
                </div>
                <div>
                  <button 
                    type="submit" 
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '1rem', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Update Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteCard(editingCard._id)} 
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', marginRight: '1rem', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#c82333';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc3545';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Delete Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingCard(null)} 
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#5a6268';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#6c757d';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {showAllCards && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {cards.map((card, cardIndex) => {
                const cardImages = card.images && card.images.length > 0 ? card.images : [card.image];
                
                return (
                <CardWithCarousel 
                  key={card._id} 
                  card={card} 
                  cardImages={cardImages}
                  onEdit={() => handleEditCard(card)}
                  onDelete={() => handleDeleteCard(card._id)}
                />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h3>Orders Management</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedService('all')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedService === 'all' ? '#007bff' : '#f8f9fa',
                color: selectedService === 'all' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              All Orders
            </button>
            {Array.from(new Set(orders.map(order => order.card.category.toLowerCase().trim()))).map(category => (
              <button
                key={category}
                onClick={() => setSelectedService(category)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedService === category ? '#007bff' : '#f8f9fa',
                  color: selectedService === category ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} Cards
              </button>
            ))}
            <button
              onClick={() => setSelectedService('billbooks')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedService === 'billbooks' ? '#007bff' : '#f8f9fa',
                color: selectedService === 'billbooks' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Billbooks
            </button>
            <button
              onClick={() => setSelectedService('visiting-cards')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedService === 'visiting-cards' ? '#007bff' : '#f8f9fa',
                color: selectedService === 'visiting-cards' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Visiting Cards
            </button>
            <button
              onClick={() => setSelectedService('rubber-stamps')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedService === 'rubber-stamps' ? '#007bff' : '#f8f9fa',
                color: selectedService === 'rubber-stamps' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Rubber Stamps
            </button>
            <button
              onClick={() => setSelectedService('bookbinding')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedService === 'bookbinding' ? '#007bff' : '#f8f9fa',
                color: selectedService === 'bookbinding' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Bookbinding
            </button>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            {orders
              .filter(order => {
                if (selectedService === 'all') return true;
                if (selectedService === order.card.category.toLowerCase().trim()) return true;
                if (selectedService === 'billbooks') return order.serviceType === 'billbooks';
                if (selectedService === 'visiting-cards') return order.serviceType === 'visiting-cards';
                if (selectedService === 'rubber-stamps') return order.serviceType === 'rubber-stamps';
                if (selectedService === 'bookbinding') return order.serviceType === 'bookbinding';
                return false;
              })
              .map((order) => {
                const profit = order.customPrice ? (order.customPrice - order.card.price) * order.quantity : 0;
                return (
                <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <img
                        src={`http://localhost:5000/uploads/${order.card.image}`}
                        alt={order.card.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <h4>{order.card.name}</h4>
                      <p>Customer: {order.user.name}</p>
                      <p>Order Date: {formatDate(order.createdAt)}</p>
                      <p>Quantity: {order.quantity} | Total: ₹{order.totalAmount}</p>
                      <p>Base Price: ₹{order.card.price} | Sold at: ₹{order.customPrice || order.card.price}</p>
                      {order.card.category.toLowerCase().includes('wedding') && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <div><strong>Total: ₹{order.totalAmount}</strong></div>
                            <div style={{ color: '#28a745' }}><strong>Advance: ₹{order.advanceAmount || 0}</strong></div>
                            <div style={{ color: '#dc3545' }}><strong>Remaining: ₹{order.totalAmount - (order.advanceAmount || 0)}</strong></div>
                          </div>
                        </div>
                      )}
                      {order.advanceAmount && !order.card.category.toLowerCase().includes('wedding') && (
                        <>
                          <p style={{ color: '#28a745' }}>Advance Paid: ₹{order.advanceAmount}</p>
                          <p style={{ color: '#dc3545', fontWeight: 'bold' }}>Remaining: ₹{order.totalAmount - order.advanceAmount}</p>
                        </>
                      )}
                      <p>Phone: {order.phone}</p>
                      <p>Delivery: {order.deliveryType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}</p>
                      {order.deliveryAddress && <p>Address: {order.deliveryAddress}</p>}
                      {order.customText && <p>Custom Text: {order.customText}</p>}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        padding: '0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: profit > 0 ? '#d4edda' : profit < 0 ? '#f8d7da' : '#f8f9fa',
                        border: `1px solid ${profit > 0 ? '#c3e6cb' : profit < 0 ? '#f5c6cb' : '#dee2e6'}`,
                        marginBottom: '0.5rem'
                      }}>
                        <strong style={{ color: profit > 0 ? '#155724' : profit < 0 ? '#721c24' : '#6c757d' }}>
                          {profit > 0 ? 'Profit' : profit < 0 ? 'Loss' : 'Break Even'}
                        </strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: profit > 0 ? '#28a745' : profit < 0 ? '#dc3545' : '#6c757d' }}>
                          ₹{Math.abs(profit)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={{ padding: '0.5rem', width: '100%' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                );
              })}
            
            {/* Service Orders */}
            {serviceOrders
              .filter(order => {
                if (selectedService === 'all') return true;
                return selectedService === order.serviceType;
              })
              .map((order) => (
                <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <h4>{order.serviceType.replace('-', ' ').toUpperCase()}</h4>
                      <p>Customer: {order.user.name}</p>
                      <p>Order Date: {formatDate(order.createdAt)}</p>
                      <p>Phone: {order.phoneNo}</p>
                      {order.name && <p>Name: {order.name}</p>}
                      {order.quantity && <p>Quantity: {order.quantity}</p>}
                      {order.totalAmount && <p>Total: ₹{order.totalAmount}</p>}
                      {order.advanceAmount && <p>Advance: ₹{order.advanceAmount}</p>}
                      {order.size && <p>Size: {order.size}</p>}
                      {order.type && <p>Type: {order.type}</p>}
                      {order.typeOfStamp && <p>Stamp Type: {order.typeOfStamp}</p>}
                      {order.description && <p>Description: {order.description}</p>}
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateServiceOrderStatus(order._id, e.target.value)}
                        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {order.totalAmount && order.advanceAmount && (
                        <p style={{ color: '#28a745', fontWeight: 'bold', textAlign: 'center' }}>
                          Remaining: ₹{order.totalAmount - order.advanceAmount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'xerox' && (
        <div>
          <h3>Xerox Management</h3>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedShop('shop1')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedShop === 'shop1' ? '#007bff' : '#f8f9fa',
                color: selectedShop === 'shop1' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Shop 1
            </button>
            <button
              onClick={() => setSelectedShop('shop2')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedShop === 'shop2' ? '#007bff' : '#f8f9fa',
                color: selectedShop === 'shop2' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Shop 2
            </button>
            <button
              onClick={() => setSelectedShop('shop3')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedShop === 'shop3' ? '#007bff' : '#f8f9fa',
                color: selectedShop === 'shop3' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Shop 3
            </button>
            <button
              onClick={() => setSelectedShop('summary')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedShop === 'summary' ? '#007bff' : '#f8f9fa',
                color: selectedShop === 'summary' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Summary
            </button>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            {selectedShop === 'summary' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h4>All Shops Summary</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontWeight: 'bold' }}>Filter Type:</label>
                      <select
                        value={dateRangeType}
                        onChange={(e) => {
                          const newType = e.target.value as 'single' | 'range';
                          setDateRangeType(newType);
                          setSelectedDate('');
                          setFromDate('');
                          setToDate('');
                        }}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      >
                        <option value="single">Single Date</option>
                        <option value="range">Date Range</option>
                      </select>
                    </div>
                    
                    {dateRangeType === 'single' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 'bold' }}>Date:</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                    
                    {dateRangeType === 'range' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontWeight: 'bold' }}>From:</label>
                          <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontWeight: 'bold' }}>To:</label>
                          <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                          />
                        </div>
                        {isExactly7Days() && (
                          <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', fontSize: '0.9rem' }}>
                            📊 7-day range detected - Weekly comparison enabled
                          </div>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={clearDateFilters}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Show Shops:</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={shopFilters.shop1}
                      onChange={(e) => setShopFilters({...shopFilters, shop1: e.target.checked})}
                    />
                    Shop 1
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={shopFilters.shop2}
                      onChange={(e) => setShopFilters({...shopFilters, shop2: e.target.checked})}
                    />
                    Shop 2
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={shopFilters.shop3}
                      onChange={(e) => setShopFilters({...shopFilters, shop3: e.target.checked})}
                    />
                    Shop 3
                  </label>
                </div>
                <ShopCharts 
                  shopReports={getShopFilteredReports(getFilteredReports())} 
                  selectedShop={selectedShop}
                  previousWeekData={isExactly7Days() ? getShopFilteredReports(getPreviousWeekData()) : []}
                  dateRangeType={isExactly7Days() ? 'week' : dateRangeType}
                />
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h5>Detailed Reports {dateRangeType === 'single' && selectedDate && `for ${formatDate(selectedDate)}`}
                      {dateRangeType === 'range' && fromDate && toDate && `from ${formatDate(fromDate)} to ${formatDate(toDate)}`}
                      {isExactly7Days() && ` (7-day comparison)`}
                    </h5>
                  </div>
                  {getShopFilteredReports(getFilteredReports()).map((report) => (
                    <div key={report._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <h5>Shop {report.shopId} - {formatDate(report.reportDate || report.createdAt)}</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <p>B&W Copies: {report.bwCopies}</p>
                        <p>Color Copies: {report.colorCopies}</p>
                        <p>Cash: ₹{report.cashCollected}</p>
                        <p>UPI: ₹{report.upiCollection}</p>
                        <p>Opening Stock: {report.paperOpeningStock}</p>
                        <p>Closing Stock: {report.paperClosingStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4>{selectedShop.toUpperCase()} Reports</h4>
                <ShopCharts shopReports={getFilteredReports()} selectedShop={selectedShop} />
                <div style={{ marginTop: '2rem' }}>
                  <h5>Detailed Reports</h5>
                  {shopReports
                    .filter(report => report.shopId === selectedShop.replace('shop', ''))
                    .map((report) => (
                      <div key={report._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <h5>Report Date: {formatDate(report.reportDate || report.createdAt)}</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                          <p>B&W Copies: {report.bwCopies}</p>
                          <p>Color Copies: {report.colorCopies}</p>
                          <p>Cash Collected: ₹{report.cashCollected}</p>
                          <p>UPI Collection: ₹{report.upiCollection}</p>
                          <p>Paper Opening Stock: {report.paperOpeningStock}</p>
                          <p>Paper Closing Stock: {report.paperClosingStock}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div>
          <h3>Employee Performance</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>From:</label>
              <input
                type="date"
                value={performanceFromDate}
                onChange={(e) => setPerformanceFromDate(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>To:</label>
              <input
                type="date"
                value={performanceToDate}
                onChange={(e) => setPerformanceToDate(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          {(() => {
            const filteredReports = shopReports.filter((report: any) => {
              if (!performanceFromDate || !performanceToDate) return true;
              const reportDate = new Date(report.reportDate);
              return reportDate >= new Date(performanceFromDate) && reportDate <= new Date(performanceToDate);
            });

            const performanceData = filteredReports.reduce((acc: any, report: any) => {
              const incharge = report.incharge || 'Unknown';
              if (!acc[incharge]) {
                acc[incharge] = { totalCash: 0, totalUPI: 0, totalCopies: 0, days: 0 };
              }
              acc[incharge].totalCash += report.cashCollected;
              acc[incharge].totalUPI += report.upiCollection;
              acc[incharge].totalCopies += report.bwCopies + report.colorCopies;
              acc[incharge].days += 1;
              return acc;
            }, {});

            const sortedPerformance = Object.entries(performanceData)
              .map(([name, data]: [string, any]) => ({
                name,
                totalRevenue: data.totalCash + data.totalUPI,
                avgDaily: (data.totalCash + data.totalUPI) / data.days,
                totalCopies: data.totalCopies,
                days: data.days
              }))
              .sort((a, b) => b.totalRevenue - a.totalRevenue);

            const maxRevenue = Math.max(...sortedPerformance.map(p => p.totalRevenue));

            return (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  {sortedPerformance.map((employee, index) => (
                    <div key={employee.name} style={{ 
                      padding: '1.5rem', 
                      backgroundColor: index === 0 ? '#d4edda' : 'white', 
                      border: `2px solid ${index === 0 ? '#28a745' : '#ddd'}`, 
                      borderRadius: '8px',
                      position: 'relative'
                    }}>
                      {index === 0 && <div style={{ position: 'absolute', top: '-10px', right: '10px', backgroundColor: '#28a745', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>🏆 Best</div>}
                      <h4 style={{ margin: '0 0 1rem 0', textTransform: 'capitalize' }}>{employee.name}</h4>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Total Revenue:</span>
                          <strong>₹{employee.totalRevenue}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Daily Average:</span>
                          <strong>₹{Math.round(employee.avgDaily)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Total Copies:</span>
                          <strong>{employee.totalCopies}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Working Days:</span>
                          <strong>{employee.days}</strong>
                        </div>
                      </div>
                      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                        <div style={{ 
                          backgroundColor: index === 0 ? '#28a745' : '#007bff', 
                          height: '100%', 
                          width: `${(employee.totalRevenue / maxRevenue) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <h4>Performance Chart</h4>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '300px', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    {sortedPerformance.map((employee, index) => (
                      <div key={employee.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{ 
                          backgroundColor: index === 0 ? '#28a745' : '#007bff',
                          width: '60px',
                          height: `${(employee.totalRevenue / maxRevenue) * 250}px`,
                          borderRadius: '4px 4px 0 0',
                          display: 'flex',
                          alignItems: 'end',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          paddingBottom: '0.5rem'
                        }}>
                          ₹{Math.round(employee.totalRevenue / 1000)}k
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {employee.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;