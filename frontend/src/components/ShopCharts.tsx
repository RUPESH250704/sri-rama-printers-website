import React from 'react';

interface ShopChartsProps {
  shopReports: any[];
  selectedShop: string;
  previousWeekData?: any[];
  dateRangeType?: string;
}

const ShopCharts: React.FC<ShopChartsProps> = ({ shopReports, selectedShop, previousWeekData = [], dateRangeType }) => {
  // Calculate totals for each shop
  const getShopTotals = (shopId: string) => {
    const shopData = shopReports.filter(report => report.shopId === shopId);
    return shopData.reduce((acc, report) => ({
      cash: acc.cash + report.cashCollected,
      upi: acc.upi + report.upiCollection,
      total: acc.total + report.cashCollected + report.upiCollection,
      bwCopies: acc.bwCopies + report.bwCopies,
      colorCopies: acc.colorCopies + report.colorCopies
    }), { cash: 0, upi: 0, total: 0, bwCopies: 0, colorCopies: 0 });
  };

  const shop1Data = getShopTotals('1');
  const shop2Data = getShopTotals('2');
  const shop3Data = getShopTotals('3');

  // Calculate filtered totals based on available shops
  const getFilteredTotals = () => {
    const availableShops = shopReports.reduce((acc, report) => {
      acc.add(report.shopId);
      return acc;
    }, new Set());
    
    let totalRevenue = 0;
    let totalCash = 0;
    let totalUpi = 0;
    let totalBwCopies = 0;
    let totalColorCopies = 0;
    
    if (availableShops.has('1')) {
      totalRevenue += shop1Data.total;
      totalCash += shop1Data.cash;
      totalUpi += shop1Data.upi;
      totalBwCopies += shop1Data.bwCopies;
      totalColorCopies += shop1Data.colorCopies;
    }
    if (availableShops.has('2')) {
      totalRevenue += shop2Data.total;
      totalCash += shop2Data.cash;
      totalUpi += shop2Data.upi;
      totalBwCopies += shop2Data.bwCopies;
      totalColorCopies += shop2Data.colorCopies;
    }
    if (availableShops.has('3')) {
      totalRevenue += shop3Data.total;
      totalCash += shop3Data.cash;
      totalUpi += shop3Data.upi;
      totalBwCopies += shop3Data.bwCopies;
      totalColorCopies += shop3Data.colorCopies;
    }
    
    return { totalRevenue, totalCash, totalUpi, totalBwCopies, totalColorCopies };
  };

  // Calculate totals for previous week
  const getPreviousWeekTotals = () => {
    return previousWeekData.reduce((acc, report) => ({
      cash: acc.cash + report.cashCollected,
      upi: acc.upi + report.upiCollection,
      total: acc.total + report.cashCollected + report.upiCollection,
      bwCopies: acc.bwCopies + report.bwCopies,
      colorCopies: acc.colorCopies + report.colorCopies
    }), { cash: 0, upi: 0, total: 0, bwCopies: 0, colorCopies: 0 });
  };

  const maxTotal = Math.max(shop1Data.total, shop2Data.total, shop3Data.total) || 1;

  const PaymentChart = ({ shopId, data }: { shopId: string, data: any }) => {
    const cashPercentage = data.total > 0 ? (data.cash / data.total) * 100 : 0;
    const upiPercentage = data.total > 0 ? (data.upi / data.total) * 100 : 0;

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h4>Shop {shopId} - Payment Methods</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '100px', fontSize: '0.9rem' }}>Cash: ₹{data.cash}</div>
          <div style={{ 
            width: '200px', 
            height: '20px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '10px',
            overflow: 'hidden',
            marginRight: '1rem'
          }}>
            <div style={{ 
              width: `${cashPercentage}%`, 
              height: '100%', 
              backgroundColor: '#28a745',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <span>{cashPercentage.toFixed(1)}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ width: '100px', fontSize: '0.9rem' }}>UPI: ₹{data.upi}</div>
          <div style={{ 
            width: '200px', 
            height: '20px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '10px',
            overflow: 'hidden',
            marginRight: '1rem'
          }}>
            <div style={{ 
              width: `${upiPercentage}%`, 
              height: '100%', 
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <span>{upiPercentage.toFixed(1)}%</span>
        </div>
        <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
          Total: ₹{data.total}
        </div>
      </div>
    );
  };

  const TotalChart = () => {
    return (
      <div style={{ marginBottom: '2rem' }}>
        <h4>Total Revenue Comparison</h4>
        <div style={{ display: 'flex', alignItems: 'end', gap: '2rem', height: '200px', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: `${(shop1Data.total / maxTotal) * 150}px`,
              backgroundColor: '#28a745',
              borderRadius: '4px 4px 0 0',
              marginBottom: '0.5rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div>Shop 1</div>
              <div>₹{shop1Data.total}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: `${(shop2Data.total / maxTotal) * 150}px`,
              backgroundColor: '#007bff',
              borderRadius: '4px 4px 0 0',
              marginBottom: '0.5rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div>Shop 2</div>
              <div>₹{shop2Data.total}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: `${(shop3Data.total / maxTotal) * 150}px`,
              backgroundColor: '#ffc107',
              borderRadius: '4px 4px 0 0',
              marginBottom: '0.5rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div>Shop 3</div>
              <div>₹{shop3Data.total}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WeeklyComparisonChart = () => {
    const currentWeekTotal = shop1Data.total + shop2Data.total + shop3Data.total;
    const previousWeekTotal = getPreviousWeekTotals();
    const difference = currentWeekTotal - previousWeekTotal.total;
    const percentageChange = previousWeekTotal.total > 0 ? ((difference / previousWeekTotal.total) * 100) : 0;

    return (
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Weekly Comparison</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'end', height: '150px', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: `${Math.min((previousWeekTotal.total / Math.max(currentWeekTotal, previousWeekTotal.total)) * 100, 100)}px`,
              backgroundColor: '#6c757d',
              borderRadius: '4px 4px 0 0',
              marginBottom: '0.5rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div>Previous Week</div>
              <div>₹{previousWeekTotal.total}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', 
              height: `${Math.min((currentWeekTotal / Math.max(currentWeekTotal, previousWeekTotal.total)) * 100, 100)}px`,
              backgroundColor: difference >= 0 ? '#28a745' : '#dc3545',
              borderRadius: '4px 4px 0 0',
              marginBottom: '0.5rem',
              transition: 'height 0.3s ease'
            }}></div>
            <div style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <div>Current Week</div>
              <div>₹{currentWeekTotal}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 'bold', 
            color: difference >= 0 ? '#28a745' : '#dc3545' 
          }}>
            {difference >= 0 ? '+' : ''}₹{difference} ({percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%)
          </div>
          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            {difference >= 0 ? 'Increase' : 'Decrease'} from previous week
          </div>
        </div>
      </div>
    );
  };

  if (selectedShop === 'summary') {
    return (
      <div>
        {dateRangeType === 'week' && previousWeekData.length > 0 && <WeeklyComparisonChart />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <PaymentChart shopId="1" data={shop1Data} />
            <PaymentChart shopId="2" data={shop2Data} />
            <PaymentChart shopId="3" data={shop3Data} />
          </div>
          <div>
            <TotalChart />
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h5>Overall Summary</h5>
              <p>Total Revenue: ₹{getFilteredTotals().totalRevenue}</p>
              <p>Total Cash: ₹{getFilteredTotals().totalCash}</p>
              <p>Total UPI: ₹{getFilteredTotals().totalUpi}</p>
              <p>Total B&W Copies: {getFilteredTotals().totalBwCopies}</p>
              <p>Total Color Copies: {getFilteredTotals().totalColorCopies}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Individual shop view
  const shopNumber = selectedShop.replace('shop', '');
  const shopData = getShopTotals(shopNumber);

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <PaymentChart shopId={shopNumber} data={shopData} />
        </div>
        <div>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h5>Shop {shopNumber} Summary</h5>
            <p>Total Revenue: ₹{shopData.total}</p>
            <p>Cash Collection: ₹{shopData.cash}</p>
            <p>UPI Collection: ₹{shopData.upi}</p>
            <p>B&W Copies: {shopData.bwCopies}</p>
            <p>Color Copies: {shopData.colorCopies}</p>
            <p>Total Copies: {shopData.bwCopies + shopData.colorCopies}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCharts;