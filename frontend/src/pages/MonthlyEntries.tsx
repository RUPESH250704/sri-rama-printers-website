import React, { useState, useEffect, useCallback } from 'react';
import { shopsAPI } from '../services/api';

const MonthlyEntries: React.FC = () => {
  const [selectedShop, setSelectedShop] = useState('1');
  const [entries, setEntries] = useState<any[]>([]);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await shopsAPI.getThisMonthEntries(selectedShop);
      setEntries(response.data.entries);
      setMonth(response.data.month);
      setYear(response.data.year);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, [selectedShop]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Monthly Entries - {monthNames[month - 1]} {year}</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Select Shop:</label>
        <select 
          value={selectedShop} 
          onChange={(e) => setSelectedShop(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="1">Shop 1</option>
          <option value="2">Shop 2</option>
          <option value="3">Shop 3</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h3>Entries for Shop {selectedShop}</h3>
        
        {entries.length === 0 ? (
          <p>No entries found for this month.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const entry = entries.find(e => e.date === day);
              return (
                <div
                  key={day}
                  style={{
                    padding: '0.5rem',
                    textAlign: 'center',
                    backgroundColor: entry ? '#d4edda' : '#f8f9fa',
                    border: `1px solid ${entry ? '#c3e6cb' : '#dee2e6'}`,
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                  title={entry ? `Entry by ${entry.incharge}` : 'No entry'}
                >
                  <div style={{ fontWeight: 'bold' }}>{day}</div>
                  {entry && <div style={{ fontSize: '0.7rem', color: '#28a745' }}>✓</div>}
                </div>
              );
            })}
          </div>
        )}
        
        <div style={{ marginTop: '2rem' }}>
          <h4>Summary:</h4>
          <p>Total entries: {entries.length} out of {new Date(year, month, 0).getDate()} days</p>
          <p>Completion: {Math.round((entries.length / new Date(year, month, 0).getDate()) * 100)}%</p>
        </div>

        {entries.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h4>Entry Details:</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {entries.map(entry => (
                <div key={entry.date} style={{ padding: '0.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{monthNames[month - 1]} {entry.date}, {year}</span>
                  <span style={{ color: '#007bff' }}>Incharge: {entry.incharge}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyEntries;