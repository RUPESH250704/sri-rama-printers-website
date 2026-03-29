import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
          Welcome to Sri Rama Prints
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Your one-stop destination for beautiful wedding invitation cards
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', justifyContent: 'center' }}>
          {user?.email !== 'chrupesh025@gmail.com' && (
            <Link
              to="/xerox"
              style={{ 
                display: 'inline-block',
                padding: '3rem 4rem', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                backgroundColor: 'black', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                minWidth: '250px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
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
              Xerox
            </Link>
          )}
          <Link
            to="/sri-rama-prints"
            style={{ 
              display: 'inline-block',
              padding: '3rem 4rem', 
              fontSize: '2rem', 
              fontWeight: 'bold',
              backgroundColor: 'black', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              minWidth: '250px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
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
            Sri Rama Prints
          </Link>
        </div>


      </div>
    </div>
  );
};

export default Home;