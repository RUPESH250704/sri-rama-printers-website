import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../types';
import { cardsAPI } from '../services/api';

const Cards: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await cardsAPI.getAll();
      const cardsData = response.data.data || response.data;
      setCards(cardsData);
      setFilteredCards(cardsData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(cardsData.map((card: Card) => card.category))) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredCards(cards);
    } else {
      setFilteredCards(cards.filter(card => card.category === category));
    }
  };

  const handleOrderCard = (cardId: string) => {
    navigate(`/order/${cardId}`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Wedding Cards</h2>
      
      {/* Category Filter */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Filter by Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => handleCategoryFilter(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            borderRadius: '4px', 
            border: '1px solid #ddd',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <span style={{ marginLeft: '1rem', color: '#666' }}>({filteredCards.length} cards)</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        {filteredCards.map((card) => (
          <div key={card._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: 'white' }}>
            <img
              src={`http://localhost:5000/uploads/${card.image}`}
              alt={card.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
            />
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>{card.name}</h3>
            <p style={{ color: '#007bff', fontSize: '0.9rem', margin: '0.5rem 0', fontWeight: 'bold' }}>
              {card.category.charAt(0).toUpperCase() + card.category.slice(1)}
            </p>
            <p style={{ color: '#666', marginBottom: '1rem' }}>{card.description}</p>
            <p style={{ fontSize: '0.9rem', color: card.stock > 0 ? '#28a745' : '#dc3545', margin: '0.5rem 0' }}>Stock: {card.stock}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button
                onClick={() => handleOrderCard(card._id)}
                disabled={card.stock === 0}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: card.stock === 0 ? '#6c757d' : '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: card.stock === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (card.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (card.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#007bff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {card.stock === 0 ? 'Out of Stock' : 'Order Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;