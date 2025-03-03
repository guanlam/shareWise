import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Section from '../components/Section';
import axiosClient from '../axios-client';
import 'chart.js/auto'; // Important to auto register chart.js components

const allMonthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Simple Exponential Smoothing function
function simpleExponentialSmoothing(data, alpha) {
  if (!data || data.length === 0) return [];
  const forecast = [data[0]]; // initialize with first value
  for (let i = 1; i < data.length; i++) {
    forecast.push(alpha * data[i] + (1 - alpha) * forecast[i - 1]);
  }
  return forecast;
}

function Forecast() {
  const [historical, setHistorical] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const alpha = 0.3; // smoothing constant

  useEffect(() => {
    axiosClient.get('/historical-monthly-expenses')
      .then(response => {
        // Response is in format: { historicalExpenses: { "2024-03": value, ..., "2025-01": value } }
        const dataObj = response.data.historicalExpenses;
        // Sort keys chronologically
        const sortedKeys = Object.keys(dataObj).sort();
        const expensesArray = sortedKeys.map(key => dataObj[key]);
        setHistorical(expensesArray);

        // Compute forecast using exponential smoothing on historical data
        const histForecast = simpleExponentialSmoothing(expensesArray, alpha);
        
        // Extend forecast for next 2 months
        const futureForecast = [histForecast[histForecast.length - 1], histForecast[histForecast.length - 1]];
        setForecast([...histForecast, ...futureForecast]);

        // Build labels: Convert sorted keys (YYYY-MM) into "Month Year" strings.
        const historicalLabels = sortedKeys.map(key => {
          const [year, month] = key.split('-');
          return `${allMonthLabels[parseInt(month, 10) - 1]} ${year}`;
        });
        // For forecast months, add the next 2 months with year adjustment
        const lastKey = sortedKeys[sortedKeys.length - 1]; // e.g., "2025-01"
        const [lastYear, lastMonth] = lastKey.split('-').map(Number);
        let forecastLabels = [];
        for (let i = 1; i <= 2; i++) {
          const nextMonthNum = lastMonth + i;
          let forecastMonth, forecastYear;
          if (nextMonthNum > 12) {
            forecastMonth = nextMonthNum - 12;
            forecastYear = lastYear + 1;
          } else {
            forecastMonth = nextMonthNum;
            forecastYear = lastYear;
          }
          forecastLabels.push(`${allMonthLabels[forecastMonth - 1]} ${forecastYear}`);
        }
        setLabels([...historicalLabels, ...forecastLabels]);

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching historical data:", error);
        setLoading(false);
      });
  }, []);

  // Prepare chart data. The forecast array now has historical data plus 2 extra points.
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Actual Spending',
        data: [...historical, null, null],
        borderColor: 'black',
        tension: 0.3,
      },
      {
        label: 'Forecasted Spending',
        data: forecast,
        borderColor: 'green',
        borderDash: [5, 5],
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => 'RM ' + tooltipItem.parsed.y.toFixed(2)
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (RM)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month (Year)',
        },
      },
    },
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Section className="flex flex-col gap-4 p-4 bg-light-mint !w-full">
      <h1 className='text-big font-bold text-center'>Spending Forecast Monthly</h1>
      <div
        className='size-full all-center'
        style={{
          position: 'relative',
          width: '100%',
          height: '500px', // adjust as needed
          overflow: 'hidden'
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </Section>
  );
}

export default Forecast;
