import React from 'react';
import { Link } from 'react-router-dom';

const Xerox: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#333' }}>
          Xerox
        </h1>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', justifyContent: 'center' }}>
          <Link
            to="/shop/1"
            style={{
              display: 'inline-block',
              padding: '3rem 4rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '200px',
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
            SHOP 1
          </Link>
          
          <Link
            to="/shop/2"
            style={{
              display: 'inline-block',
              padding: '3rem 4rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '200px',
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
            SHOP 2
          </Link>
          
          <Link
            to="/shop/3"
            style={{
              display: 'inline-block',
              padding: '3rem 4rem',
              backgroundColor: 'black',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              minWidth: '200px',
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
            SHOP 3
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Xerox;