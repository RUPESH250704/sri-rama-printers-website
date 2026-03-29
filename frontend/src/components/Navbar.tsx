import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#000000', borderBottom: '1px solid #dee2e6' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#ffffff' }}>
          Sri Rama Prints
        </Link>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#ffffff' }}>Welcome, {user.name}</span>
              {user.email !== 'chrupesh025@gmail.com' && (
                <Link to="/monthly-entries" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>Monthly Entries</Link>
              )}
              {user.isAdmin && user.email !== 'chrupesh025@gmail.com' && (
                <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff' }}>Admin Dashboard</Link>
              )}
              <button 
                onClick={handleLogout} 
                style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.3s ease' }}
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
                Logout
              </button>
            </>
          ) : (
            <>
              <StyledWrapper>
                <Link to="/login" className="user-profile">
                  <div className="user-profile-inner">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g data-name="Layer 2" id="Layer_2">
                        <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                      </g>
                    </svg>
                    <p>Log In</p>
                  </div>
                </Link>
              </StyledWrapper>

            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const StyledWrapper = styled.div`
  .user-profile {
    width: 131px;
    height: 51px;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.3s ease;
    background: linear-gradient(
      to bottom right,
      #2e8eff 0%,
      rgba(46, 142, 255, 0) 30%
    );
    background-color: rgba(46, 142, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .user-profile:hover,
  .user-profile:focus {
    background-color: rgba(46, 142, 255, 0.7);
    box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
    outline: none;
  }

  .user-profile-inner {
    width: 127px;
    height: 47px;
    border-radius: 13px;
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: #fff;
    font-weight: 600;
  }

  .user-profile-inner svg {
    width: 27px;
    height: 27px;
    fill: #fff;
  }

  .user-profile-inner p {
    margin: 0;
  }


`;

export default Navbar;