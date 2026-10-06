import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopsAPI } from '../services/api';
import ShopCharts from '../components/ShopCharts';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'xerox' | 'performance'>('xerox');
  const [shopReports, setShopReports] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('shop1');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dateRangeType, setDateRangeType] = useState<'single' | 'range'>('single');
  const [shopFilters, setShopFilters] = useState({ shop1: true, shop2: true, shop3: true });
  const [performanceFromDate, setPerformanceFromDate] = useState<string>('');
  const [performanceToDate, setPerformanceToDate] = useState<string>('');

  useEffect(() => {
    fetchShopReports();
  }, []);

  const fetchShopReports = async () => {
    try {
      const response = await shopsAPI.getAllReports();
      setShopReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching shop reports:', error);
      setShopReports([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isExactly7Days = () => {
    if (dateRangeType === 'range' && fromDate && toDate) {
      const diffTime = Math.abs(new Date(toDate).getTime() - new Date(fromDate).getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) === 6;
    }
    return false;
  };

  const getFilteredReports = () => {
    const getReportDate = (r: any) => r.reportDate || r.createdAt;
    if (dateRangeType === 'single' && selectedDate) {
      return shopReports.filter(r =>
        new Date(getReportDate(r)).toDateString() === new Date(selectedDate).toDateString()
      );
    } else if (dateRangeType === 'range' && fromDate && toDate) {
      return shopReports.filter(r => {
        const d = new Date(getReportDate(r));
        return d >= new Date(fromDate) && d <= new Date(toDate);
      });
    }
    return shopReports;
  };

  const getShopFilteredReports = (reports: any[]) =>
    reports.filter(r => {
      if (r.shopId === '1' && !shopFilters.shop1) return false;
      if (r.shopId === '2' && !shopFilters.shop2) return false;
      if (r.shopId === '3' && !shopFilters.shop3) return false;
      return true;
    });

  const getPreviousWeekData = () => {
    if (!isExactly7Days() || !fromDate) return [];
    const prevStart = new Date(fromDate);
    prevStart.setDate(prevStart.getDate() - 7);
    const prevEnd = new Date(prevStart);
    prevEnd.setDate(prevEnd.getDate() + 6);
    return shopReports.filter(r => {
      const d = new Date(r.reportDate || r.createdAt);
      return d >= prevStart && d <= prevEnd;
    });
  };

  const clearDateFilters = () => {
    setSelectedDate(''); setFromDate(''); setToDate(''); setDateRangeType('single');
  };

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: '1rem 2rem',
    background: activeTab === tab
      ? 'linear-gradient(145deg, #0056b3, #007bff, #4dabf7)'
      : 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: activeTab === tab
      ? '0 8px 16px rgba(0,123,255,0.3)'
      : '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  });

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button className="admin-tab-btn" style={tabStyle('xerox')} onClick={() => setActiveTab('xerox')}>
          XEROX
        </button>
        <button className="admin-tab-btn" style={tabStyle('performance')} onClick={() => setActiveTab('performance')}>
          Employee Performance
        </button>
        <button
          className="admin-tab-btn"
          style={{ ...tabStyle('attendance'), background: 'linear-gradient(145deg, #ffffff, #f8f9fa, #e9ecef)', color: '#333' }}
          onClick={() => navigate('/attendance')}
        >
          Attendance
        </button>
      </div>

      {/* ── XEROX TAB ── */}
      {activeTab === 'xerox' && (
        <div>
          <h3>Xerox Management</h3>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {['shop1', 'shop2', 'shop3', 'summary'].map(shop => (
              <button
                key={shop}
                onClick={() => setSelectedShop(shop)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedShop === shop ? '#007bff' : '#f8f9fa',
                  color: selectedShop === shop ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {shop === 'summary' ? 'Summary' : `Shop ${shop.replace('shop', '')}`}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            {selectedShop === 'summary' ? (
              <div>
                {/* Date filters */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h4>All Shops Summary</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontWeight: 'bold' }}>Filter:</label>
                      <select
                        value={dateRangeType}
                        onChange={(e) => { setDateRangeType(e.target.value as 'single' | 'range'); setSelectedDate(''); setFromDate(''); setToDate(''); }}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      >
                        <option value="single">Single Date</option>
                        <option value="range">Date Range</option>
                      </select>
                    </div>
                    {dateRangeType === 'single' && (
                      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                    )}
                    {dateRangeType === 'range' && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontWeight: 'bold' }}>From:</label>
                          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label style={{ fontWeight: 'bold' }}>To:</label>
                          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        {isExactly7Days() && (
                          <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', fontSize: '0.9rem' }}>
                            📊 7-day range — weekly comparison enabled
                          </div>
                        )}
                      </>
                    )}
                    <button onClick={clearDateFilters}
                      style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Clear
                    </button>
                  </div>
                </div>

                {/* Shop checkboxes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #ddd', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Show Shops:</span>
                  {(['shop1', 'shop2', 'shop3'] as const).map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={shopFilters[s]}
                        onChange={e => setShopFilters({ ...shopFilters, [s]: e.target.checked })} />
                      Shop {s.replace('shop', '')}
                    </label>
                  ))}
                </div>

                <ShopCharts
                  shopReports={getShopFilteredReports(getFilteredReports())}
                  selectedShop={selectedShop}
                  previousWeekData={isExactly7Days() ? getShopFilteredReports(getPreviousWeekData()) : []}
                  dateRangeType={isExactly7Days() ? 'week' : dateRangeType}
                />

                <div style={{ marginTop: '2rem' }}>
                  <h5>Detailed Reports
                    {dateRangeType === 'single' && selectedDate && ` for ${formatDate(selectedDate)}`}
                    {dateRangeType === 'range' && fromDate && toDate && ` from ${formatDate(fromDate)} to ${formatDate(toDate)}`}
                    {isExactly7Days() && ' (7-day comparison)'}
                  </h5>
                  {getShopFilteredReports(getFilteredReports()).map(report => (
                    <div key={report._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                      <h5>Shop {report.shopId} — {formatDate(report.reportDate || report.createdAt)}</h5>
                      <div className="shop-report-grid">
                        <p>B&W Copies: {report.bwCopies}</p>
                        <p>Color Copies: {report.colorCopies}</p>
                        <p>Cash: ₹{report.cashCollected}</p>
                        <p>UPI: ₹{report.upiCollection}</p>
                        <p>Opening Stock: {report.paperOpeningStock}</p>
                        <p>Closing Stock: {report.paperClosingStock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h4>{selectedShop.toUpperCase()} Reports</h4>
                <ShopCharts shopReports={getFilteredReports()} selectedShop={selectedShop} />
                <div style={{ marginTop: '2rem' }}>
                  <h5>Detailed Reports</h5>
                  {shopReports
                    .filter(r => r.shopId === selectedShop.replace('shop', ''))
                    .map(report => (
                      <div key={report._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                        <h5>Report Date: {formatDate(report.reportDate || report.createdAt)}</h5>
                        <div className="shop-report-grid">
                          <p>B&W Copies: {report.bwCopies}</p>
                          <p>Color Copies: {report.colorCopies}</p>
                          <p>Cash Collected: ₹{report.cashCollected}</p>
                          <p>UPI Collection: ₹{report.upiCollection}</p>
                          <p>Paper Opening Stock: {report.paperOpeningStock}</p>
                          <p>Paper Closing Stock: {report.paperClosingStock}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PERFORMANCE TAB ── */}
      {activeTab === 'performance' && (
        <div>
          <h3>Employee Performance</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>From:</label>
              <input type="date" value={performanceFromDate} onChange={e => setPerformanceFromDate(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontWeight: 'bold' }}>To:</label>
              <input type="date" value={performanceToDate} onChange={e => setPerformanceToDate(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
          </div>

          {(() => {
            const filtered = shopReports.filter(r => {
              if (!performanceFromDate || !performanceToDate) return true;
              const d = new Date(r.reportDate);
              return d >= new Date(performanceFromDate) && d <= new Date(performanceToDate);
            });

            const perfData = filtered.reduce((acc: any, r: any) => {
              const name = r.incharge || 'Unknown';
              if (!acc[name]) acc[name] = { totalCash: 0, totalUPI: 0, totalCopies: 0, days: 0 };
              acc[name].totalCash += r.cashCollected;
              acc[name].totalUPI += r.upiCollection;
              acc[name].totalCopies += r.bwCopies + r.colorCopies;
              acc[name].days += 1;
              return acc;
            }, {});

            const sorted = Object.entries(perfData)
              .map(([name, d]: [string, any]) => ({
                name,
                totalRevenue: d.totalCash + d.totalUPI,
                avgDaily: (d.totalCash + d.totalUPI) / d.days,
                totalCopies: d.totalCopies,
                days: d.days
              }))
              .sort((a, b) => b.totalRevenue - a.totalRevenue);

            const maxRevenue = Math.max(...sorted.map(p => p.totalRevenue), 1);

            return (
              <div>
                <div className="performance-grid">
                  {sorted.map((emp, i) => (
                    <div key={emp.name} style={{
                      padding: '1.5rem',
                      backgroundColor: i === 0 ? '#d4edda' : 'white',
                      border: `2px solid ${i === 0 ? '#28a745' : '#ddd'}`,
                      borderRadius: '8px',
                      position: 'relative'
                    }}>
                      {i === 0 && <div style={{ position: 'absolute', top: '-10px', right: '10px', backgroundColor: '#28a745', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>🏆 Best</div>}
                      <h4 style={{ margin: '0 0 1rem 0', textTransform: 'capitalize' }}>{emp.name}</h4>
                      {[['Total Revenue', `₹${emp.totalRevenue}`], ['Daily Average', `₹${Math.round(emp.avgDaily)}`], ['Total Copies', emp.totalCopies], ['Working Days', emp.days]].map(([label, val]) => (
                        <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>{label}:</span><strong>{val}</strong>
                        </div>
                      ))}
                      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', height: '20px', overflow: 'hidden', marginTop: '0.5rem' }}>
                        <div style={{ backgroundColor: i === 0 ? '#28a745' : '#007bff', height: '100%', width: `${(emp.totalRevenue / maxRevenue) * 100}%`, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
                  <h4>Performance Chart</h4>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '1rem', height: '300px', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    {sorted.map((emp, i) => (
                      <div key={emp.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{
                          backgroundColor: i === 0 ? '#28a745' : '#007bff',
                          width: '60px',
                          height: `${(emp.totalRevenue / maxRevenue) * 250}px`,
                          borderRadius: '4px 4px 0 0',
                          display: 'flex', alignItems: 'end', justifyContent: 'center',
                          color: 'white', fontSize: '0.8rem', fontWeight: 'bold', paddingBottom: '0.5rem'
                        }}>
                          ₹{Math.round(emp.totalRevenue / 1000)}k
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{emp.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
