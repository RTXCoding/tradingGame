import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [cash, setCash] = useState(() => {
    const saved = localStorage.getItem('trading_game_cash');
    return saved !== null ? JSON.parse(saved) : 1000;
  });

  const [shares, setShares] = useState(() => {
    const saved = localStorage.getItem('trading_game_shares');
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [stockPrice, setStockPrice] = useState(() => {
    const saved = localStorage.getItem('trading_game_price');
    return saved !== null ? JSON.parse(saved) : 100;
  });

  const [priceHistory, setPriceHistory] = useState([stockPrice]);
  const [labels, setLabels] = useState(['Tick 0']);

  useEffect(() => {
    localStorage.setItem('trading_game_cash', JSON.stringify(cash));
    localStorage.setItem('trading_game_shares', JSON.stringify(shares));
    localStorage.setItem('trading_game_price', JSON.stringify(stockPrice));
  }, [cash, shares, stockPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrice((prevPrice) => {
        const changePercent = (Math.random() - 0.48) * 0.1;
        const newPrice = Math.max(1, parseFloat((prevPrice * (1 + changePercent)).toFixed(2)));

        setPriceHistory((prev) => [...prev.slice(-19), newPrice]);
        setLabels((prev) => [...prev.slice(-19), `Tick ${prev.length}`]);

        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const buyStock = () => {
    if (cash >= stockPrice) {
      setCash((prev) => parseFloat((prev - stockPrice).toFixed(2)));
      setShares((prev) => prev + 1);
    }
  };

  const sellStock = () => {
    if (shares > 0) {
      setCash((prev) => parseFloat((prev + stockPrice).toFixed(2)));
      setShares((prev) => prev - 1);
    }
  };

  const resetGame = () => {
    localStorage.clear();
    setCash(1000);
    setShares(0);
    setStockPrice(100);
    setPriceHistory([100]);
  };

  const netWorth = (cash + shares * stockPrice).toFixed(2);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Stock Price ($)',
        data: priceHistory,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.2,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>📈 Paper Trading Simulator</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div><strong>Cash:</strong> ${cash.toFixed(2)}</div>
        <div><strong>Shares Held:</strong> {shares}</div>
        <div><strong>Current Price:</strong> ${stockPrice.toFixed(2)}</div>
        <div><strong>Net Worth:</strong> ${netWorth}</div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={buyStock} disabled={cash < stockPrice} style={{ flex: 1, padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Buy 1 Share (${stockPrice.toFixed(2)})
        </button>
        <button onClick={sellStock} disabled={shares <= 0} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Sell 1 Share (${stockPrice.toFixed(2)})
        </button>
      </div>

      <div style={{ background: '#fff', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '15px' }}>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      <button onClick={resetGame} style={{ padding: '8px 12px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Reset Progress
      </button>
    </div>
  );
}