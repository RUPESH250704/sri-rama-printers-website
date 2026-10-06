import React from 'react';
import { Link } from 'react-router-dom';

const btnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'black',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '16px',
  fontSize: '2rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  flex: '1 1 0',
  minHeight: '140px',
};

const Xerox: React.FC = () => {
  const hover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#222';
    e.currentTarget.style.transform = 'scale(1.03)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35)';
  };
  const unhover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = 'black';
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem',
      gap: '1.5rem',
    }}>
      <Link to="/shop/1" style={btnStyle} onMouseEnter={hover} onMouseLeave={unhover}>SHOP 1</Link>
      <Link to="/shop/2" style={btnStyle} onMouseEnter={hover} onMouseLeave={unhover}>SHOP 2</Link>
      <Link to="/shop/3" style={btnStyle} onMouseEnter={hover} onMouseLeave={unhover}>SHOP 3</Link>
    </div>
  );
};

export default Xerox;
