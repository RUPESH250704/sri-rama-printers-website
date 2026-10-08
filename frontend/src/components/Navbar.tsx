import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Navbar: React.FC = () => {
  const { user, lock } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLock = () => {
    lock();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav style={{ padding: '0.75rem 1rem', backgroundColor: '#000000', borderBottom: '1px solid #dee2e6', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#ffffff' }}>
          Sri Rama Prints
        </Link>

        {/* Hamburger button — only visible on mobile via CSS */}
        <HamburgerBtn onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </HamburgerBtn>

        {/* Desktop nav */}
        <DesktopActions className="navbar-actions">
          {user ? (
            <>
              <Link to="/monthly-entries" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>Monthly Entries</Link>
              <Link to="/admin" style={{ textDecoration: 'none', color: '#007bff' }}>Admin</Link>
              <button onClick={handleLock} style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                🔒 Lock
              </button>
            </>
          ) : (
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
          )}
        </DesktopActions>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <MobileMenu>
          {user ? (
            <>
              <Link to="/monthly-entries" onClick={() => setMenuOpen(false)} style={{ color: '#28a745', fontWeight: 'bold', padding: '0.5rem 0', textDecoration: 'none' }}>Monthly Entries</Link>
              <Link to="/admin" onClick={() => setMenuOpen(false)} style={{ color: '#007bff', padding: '0.5rem 0', textDecoration: 'none' }}>Admin Dashboard</Link>
              <button onClick={handleLock} style={{ padding: '0.6rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}>
                🔒 Lock
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: '#fff', padding: '0.5rem 0', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
          )}
        </MobileMenu>
      )}
    </nav>
  );
};

const HamburgerBtn = styled.button`
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: #fff;
    border-radius: 2px;
  }

  @media (max-width: 600px) {
    display: flex;
  }
`;

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    display: none;
  }
`;

const MobileMenu = styled.div`
  display: none;
  flex-direction: column;
  padding: 0.75rem 0 0.25rem;
  border-top: 1px solid #333;
  margin-top: 0.5rem;

  @media (max-width: 600px) {
    display: flex;
  }
`;

const StyledWrapper = styled.div`
  .user-profile {
    width: 110px;
    height: 44px;
    border-radius: 15px;
    cursor: pointer;
    transition: 0.3s ease;
    background: linear-gradient(to bottom right, #2e8eff 0%, rgba(46, 142, 255, 0) 30%);
    background-color: rgba(46, 142, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .user-profile:hover { background-color: rgba(46, 142, 255, 0.7); }

  .user-profile-inner {
    width: 106px;
    height: 40px;
    border-radius: 13px;
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
    font-weight: 600;
  }

  .user-profile-inner svg { width: 22px; height: 22px; fill: #fff; }
  .user-profile-inner p { margin: 0; font-size: 0.9rem; }
`;

export default Navbar;
