import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, authAPI, shopsAPI } from '../services/api';

const ShopForm: React.FC = () => {
  const { shopId } = useParams();
  const [formData, setFormData] = useState({
    reportDate: new Date().toISOString().split('T')[0], // Default to today
    bwCopies: '',
    colorCopies: '',
    cashCollected: '',
    upiCollection: '',
    paperOpeningStock: '',
    paperClosingStock: '',
    incharge: ''
  });
  const [reportedDates, setReportedDates] = useState<string[]>([]);
  const [inchargeOptions, setInchargeOptions] = useState<string[]>([]);

  const fetchInchargeOptions = useCallback(async () => {
    try {
      const response = await authAPI.getInchargeOptions();
      setInchargeOptions(Array.isArray(response.data?.names) ? response.data.names : []);
    } catch (error) {
      console.error('Error fetching incharge options:', error);
      setInchargeOptions([]);
    }
  }, []);

  const fetchReportedDates = useCallback(async () => {
    try {
      const response = await shopsAPI.getReportedDates(shopId || '');
      const data = response.data;
      console.log('Reported dates from API:', data.dates);
      console.log('First few dates:', data.dates.slice(0, 10));
      setReportedDates(data.dates || []);
    } catch (error) {
      console.error('Error fetching reported dates:', error);
    }
  }, [shopId]);

  useEffect(() => {
    fetchReportedDates();
  }, [fetchReportedDates]);

  useEffect(() => {
    fetchInchargeOptions();
  }, [fetchInchargeOptions]);

  const checkExistingReport = (date: string) => {
    // Convert YYYY-MM-DD to DD-MM-YYYY for comparison
    const [year, month, day] = date.split('-');
    const ddmmyyyy = `${day}-${month}-${year}`;
    console.log('Checking date:', date, 'converted to:', ddmmyyyy);
    console.log('Reported dates array:', reportedDates);
    console.log('Date exists:', reportedDates.includes(ddmmyyyy));
    return reportedDates.includes(ddmmyyyy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for existing report
    const exists = checkExistingReport(formData.reportDate);
    if (exists) {
      const confirmSubmit = window.confirm('A report for this date already exists. Do you want to submit anyway? This may create duplicate entries.');
      if (!confirmSubmit) {
        return;
      }
    }
    
    try {
      const response = await fetch(`${API_URL}/shops/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...formData, shopId })
      });
      
      if (response.ok) {
        alert('Report submitted successfully!');
        setFormData({ 
          reportDate: new Date().toISOString().split('T')[0],
          bwCopies: '', 
          colorCopies: '', 
          cashCollected: '', 
          upiCollection: '', 
          paperOpeningStock: '', 
          paperClosingStock: '',
          incharge: ''
        });
        fetchReportedDates(); // Refresh reported dates
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit report');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
        Shop {shopId} - Daily Report
      </h1>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {checkExistingReport(formData.reportDate) ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745' }}>
            <h2 style={{ color: '#28a745', marginBottom: '1rem' }}>✓ Entry Done</h2>
            <p style={{ fontSize: '1.2rem', color: '#155724' }}>Report already exists for {formData.reportDate}</p>
            <div style={{ marginTop: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#155724' }}>
                Select Another Date:
              </label>
              <input
                type="date"
                value={formData.reportDate}
                onChange={handleChange}
                name="reportDate"
                max={new Date().toISOString().split('T')[0]}
                style={{ padding: '0.75rem', border: '2px solid #28a745', borderRadius: '4px', fontSize: '1rem' }}
              />
            </div>
          </div>
        ) : (
          <>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Report Date:
          </label>
          <input
            type="date"
            name="reportDate"
            value={formData.reportDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '2px solid ' + (checkExistingReport(formData.reportDate) ? '#28a745' : '#dc3545'), 
              borderRadius: '4px',
              backgroundColor: checkExistingReport(formData.reportDate) ? '#d4edda' : '#f8d7da'
            }}
          />
          <small style={{ color: checkExistingReport(formData.reportDate) ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {checkExistingReport(formData.reportDate) ? '✓ Report exists for this date' : '⚠ No report found for this date'}
          </small>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Incharge:
          </label>
          <select
            name="incharge"
            value={formData.incharge}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Incharge</option>
            {inchargeOptions.map((name) => (
              <option key={name} value={name.toLowerCase()}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Total No of Black & White Copies:
          </label>
          <input
            type="number"
            name="bwCopies"
            value={formData.bwCopies}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Total No of Color Copies:
          </label>
          <input
            type="number"
            name="colorCopies"
            value={formData.colorCopies}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Cash Collected:
          </label>
          <input
            type="number"
            name="cashCollected"
            value={formData.cashCollected}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            UPI Collection:
          </label>
          <input
            type="number"
            name="upiCollection"
            value={formData.upiCollection}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Paper Opening Stock:
          </label>
          <input
            type="number"
            name="paperOpeningStock"
            value={formData.paperOpeningStock}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Paper Closing Stock:
          </label>
          <input
            type="number"
            name="paperClosingStock"
            value={formData.paperClosingStock}
            onChange={handleChange}
            onWheel={(e) => e.currentTarget.blur()}
            required
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
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
          Submit Report
        </button>
        </>
        )}
      </form>
    </div>
  );
};

export default ShopForm;