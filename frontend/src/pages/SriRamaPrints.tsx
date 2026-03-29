import React from 'react';
import { Link } from 'react-router-dom';

const SriRamaPrints: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#333' }}>
          Sri Rama Prints
        </h1>
        
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <Link
            to="/cards"
            style={{
              display: 'block',
              padding: '2rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            WEDDING CARDS
          </Link>
          
          <Link
            to="/billbooks-order"
            style={{
              display: 'block',
              padding: '2rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            BILLBOOKS
          </Link>
          
          <Link
            to="/visiting-cards-order"
            style={{
              display: 'block',
              padding: '2rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            VISITING CARDS
          </Link>
          
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <Link
              to="/rubber-stamps-order"
              style={{
                display: 'block',
                padding: '2rem',
                backgroundColor: 'black',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                flex: '1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'black';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              RUBBER STAMPS
            </Link>
            
            <Link
              to="/bookbinding-order"
              style={{
                display: 'block',
                padding: '2rem',
                backgroundColor: 'black',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                flex: '1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'black';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              BOOKBINDING
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SriRamaPrints;