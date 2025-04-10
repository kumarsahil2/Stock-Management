import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StockChart = ({ data }) => {
  const chartData = {
    labels: data.map(p => p.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: data.map(p => p.stockQuantity),
        backgroundColor: '#60a5fa'
      },
      {
        label: 'Items Sold',
        data: data.map(p => p.itemsSold),
        backgroundColor: '#f87171'
      }
    ]
  };

  return <Bar data={chartData} />;
};

export default StockChart;
