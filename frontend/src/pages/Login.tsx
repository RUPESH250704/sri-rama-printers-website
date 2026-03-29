import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      backgroundImage: 'url("/sri-rama.jpg")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
    <div style={{ maxWidth: '500px', width: '90%', padding: '3rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(15px)' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>LOGIN</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>Email:</label>
          <StyledWrapper>
            <label className="search-label">
              <input 
                type="email" 
                name="email" 
                className="input" 
                required 
                placeholder="Enter your email..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <kbd className="slash-icon">@</kbd>
            </label>
          </StyledWrapper>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: 'bold' }}>Password:</label>
          <StyledWrapper>
            <label className="search-label">
              <input 
                type="password" 
                name="password" 
                className="input" 
                required 
                placeholder="Enter your password..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <kbd className="slash-icon">🔒</kbd>
            </label>
          </StyledWrapper>
        </div>
        <button 
          type="submit" 
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', transition: 'all 0.3s ease' }}
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
          Login
        </button>
      </form>

    </div>
    </div>
  );
};

const StyledWrapper = styled.div`
  .search-label {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    border: 1px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    background: #3D3D3D;
    padding: 9px;
    cursor: text;
  }

  .search-label:hover {
    border-color: gray;
  }

  .search-label:focus-within {
    background: #464646;
    border-color: gray;
  }

  .search-label input {
    outline: none;
    width: 100%;
    border: none;
    background: none;
    color: rgb(162, 162, 162);
  }

  .search-label input:focus+.slash-icon,
  .search-label input:valid+.slash-icon {
    display: none;
  }

  .search-label svg,
  .slash-icon {
    position: absolute;
    color: #7e7e7e;
  }

  .slash-icon {
    right: 7px;
    border: 1px solid #393838;
    background: linear-gradient(-225deg, #343434, #6d6d6d);
    border-radius: 3px;
    text-align: center;
    box-shadow: inset 0 -2px 0 0 #3f3f3f, inset 0 0 1px 1px rgb(94, 93, 93), 0 1px 2px 1px rgba(28, 28, 29, 0.4);
    cursor: pointer;
    font-size: 12px;
    width: 15px;
  }

  .slash-icon:active {
    box-shadow: inset 0 1px 0 0 #3f3f3f, inset 0 0 1px 1px rgb(94, 93, 93), 0 1px 2px 0 rgba(28, 28, 29, 0.4);
    text-shadow: 0 1px 0 #7e7e7e;
    color: transparent;
  }
`;

export default Login;