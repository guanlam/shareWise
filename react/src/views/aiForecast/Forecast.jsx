import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Section from '../components/Section';
import axiosClient from '../axios-client';
import 'chart.js/auto';

const allMonthLabels = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

function simpleExponentialSmoothing(data, alpha) {
  if (!data || data.length === 0) return [];
  const forecast = [data[0]];
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
  const [chatGptSuggestion, setChatGptSuggestion] = useState("");
  const [fetchingSuggestion, setFetchingSuggestion] = useState(false); // Track if fetching
  const [showSuggestion, setShowSuggestion] = useState(false); // Track if user wants suggestion

  const alpha = 0.3;

  useEffect(() => {
    axiosClient.get('/historical-monthly-expenses')
      .then(response => {
        const dataObj = response.data.historicalExpenses;
        const sortedKeys = Object.keys(dataObj).sort();
        const expensesArray = sortedKeys.map(key => dataObj[key]);
        setHistorical(expensesArray);

        const histForecast = simpleExponentialSmoothing(expensesArray, alpha);
        const futureForecast = [histForecast[histForecast.length - 1], histForecast[histForecast.length - 1]];
        setForecast([...histForecast, ...futureForecast]);

        const historicalLabels = sortedKeys.map(key => {
          const [year, month] = key.split('-');
          return `${allMonthLabels[parseInt(month, 10) - 1]} ${year}`;
        });

        const lastKey = sortedKeys[sortedKeys.length - 1];
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

  const fetchChatGPTSuggestion = () => {
    setFetchingSuggestion(true);
    setChatGptSuggestion(""); // Clear old suggestion
    setShowSuggestion(true); // Show suggestion section

    const historicalAverage = historical.reduce((a, b) => a + b, 0) / historical.length;
    const forecastValue = forecast[forecast.length - 2];

    axiosClient.get('/budget-suggestion', {
      params: {
        historicalAverage,
        forecastValue,
      }
    })
    .then(res => {
      setChatGptSuggestion(res.data.suggestion);
      console.log(res);
    })
    .catch(err => {
      console.error("Error fetching ChatGPT suggestion:", err);
      setChatGptSuggestion("Failed to fetch suggestion.");
    })
    .finally(() => {
      setFetchingSuggestion(false);
    });
  };

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
      title: {
        display: true,
        text: 'Monthly Spending Forecast (Amounts in RM)',
        font: { size: 16 },
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
    <>
      <Section className="flex flex-col gap-4 p-4 bg-light-mint !w-full">
        <h1 className='text-big font-bold text-center'>Spending Forecast Monthly</h1>
        <div
          className='size-full all-center'
          style={{
            position: 'relative',
            width: '100%',
            height: '500px',
            overflow: 'hidden'
          }}
        >
          <Line data={chartData} options={options} />
        </div>

        <div className="text-center mt-4">
          {/* <h2 className="text-lg font-bold">Budget Adjustment Suggestion</h2> */}
          <p>{ forecast[forecast.length - 2] - (historical.reduce((a,b)=> a+b, 0) / historical.length) > (historical.reduce((a,b)=> a+b, 0) / historical.length)*0.1 ? 
              "Your forecast indicates a significant increase in expenses. Consider reducing discretionary spending by about 10-15%." : 
              "Your spending appears stable. Keep monitoring your expenses and adjust if needed." }
          </p>
        </div>
      </Section>

      <Section className="flex flex-col gap-4 p-4 bg-light-cyan mt-4 rounded-xl !w-full all-center">
        <h2 className="text-lg font-bold text-center">AI-Based Budget Adjustment Suggestion</h2>
        
        {!showSuggestion ? (
          <button 
            onClick={fetchChatGPTSuggestion} 
            className="bg-dark-green text-white py-2 px-4 rounded-xl mx-auto block"
            disabled={fetchingSuggestion}
          >
            {fetchingSuggestion ? "Fetching Suggestion..." : "Get AI Budget Suggestion"}
          </button>
        ) : (
          <p>{fetchingSuggestion ? "Loading suggestion..." : chatGptSuggestion}</p>
        )}
      </Section>
    </>
  );
}

export default Forecast;
