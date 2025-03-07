import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Section from "../components/Section";
import axiosClient from "../axios-client";
import "chart.js/auto";
import TypingEffect from "../components/TypingEffect";
import LoadingEffect from "../components/LoadingEffect";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const allMonthLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function simpleExponentialSmoothing(data, alpha) {
    if (!data || data.length === 0) return [];
    const forecast = [data[0]];
    for (let i = 1; i < data.length; i++) {
        forecast.push(alpha * data[i] + (1 - alpha) * forecast[i - 1]);
    }
     forecast.unshift(forecast[0]);
    

    return forecast;
}

function Forecast() {
    const [historical, setHistorical] = useState([]);
    const [forecast, setForecast] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    


    const [deepseekSuggestion, setDeepseekSuggestion] = useState("");
    const [fetchingSuggestion, setFetchingSuggestion] = useState(false); // Track if fetching
    const [showSuggestion, setShowSuggestion] = useState(false); // Track if user wants suggestion

    const alpha = 0.3;

    useEffect(() => {
        axiosClient
            .get("/historical-monthly-expenses")
            .then((response) => {
                const dataObj = response.data.historicalExpenses;
                const sortedKeys = Object.keys(dataObj).sort();
                const expensesArray = sortedKeys.map((key) => dataObj[key]);
                setHistorical(expensesArray);

                const histForecast = simpleExponentialSmoothing(
                    expensesArray,
                    alpha
                );
                const futureForecast = [
                    histForecast[histForecast.length - 1],
                    histForecast[histForecast.length - 1],
                ];
                setForecast([...histForecast, ...futureForecast]);
                
                const historicalLabels = sortedKeys.map((key) => {
                    const [year, month] = key.split("-");
                    return `${allMonthLabels[parseInt(month, 10) - 1]} ${year}`;
                });

                const lastKey = sortedKeys[sortedKeys.length - 1];
                const [lastYear, lastMonth] = lastKey.split("-").map(Number);
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
                    forecastLabels.push(
                        `${allMonthLabels[forecastMonth - 1]} ${forecastYear}`
                    );
                }
                setLabels([...historicalLabels, ...forecastLabels]);

                setLoading(false);
                
            })
            .catch((error) => {
                console.error("Error fetching historical data:", error);
                setLoading(false);
            });

            console.log("h:"+ historical);
    console.log("f:"+ forecast);
            

    }, []);

    

    const chartData = {
        labels,
        datasets: [
            {
                label: "Actual Spending",
                data: [...historical, null, null],
                borderColor: "black",
                tension: 0.3,
            },
            {
                label: "Forecasted Spending",
                data: forecast,
                borderColor: "green",
                borderDash: [5, 5],
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) =>
                        "RM " + tooltipItem.parsed.y.toFixed(2),
                },
            },
            title: {
                display: false,
                // text: "Monthly Spending Forecast (Amounts in RM)",
                // font: { size: 16 },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Amount (RM)",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Month (Year)",
                },
            },
        },
    };

    if (loading) return <div>Loading...</div>;

    //deepseek suggestion
    const fetchDeepseekSuggestion = () => {
      setFetchingSuggestion(true);
      setDeepseekSuggestion(""); // Clear old suggestion
      setShowSuggestion(true);   // Show suggestion section
    
      // First, fetch the previous month income data from your income endpoint.
      axiosClient.get("/historical-monthly-income")
        .then((incomeRes) => {
          console.log(incomeRes);
          // Assume the response is { historicalIncome: { "2024-12": value, ... } }
          const incomeData = incomeRes.data.historicalIncome;
          const incomeKeys = Object.keys(incomeData).sort(); // Sorted keys, e.g., "2024-12", "2025-01"
          const lastIncomeKey = incomeKeys[incomeKeys.length - 1];
          const previousMonthIncome = incomeData[lastIncomeKey] || 0;
    
          // Get previous month total expense from our existing historical data.
          const previousMonthExpense = historical[historical.length - 1] || 0;
    
          // Get forecasted expense for next month (assuming forecast array for future months exists)
          const forecastValue = forecast[forecast.length -3] || 0;
          console.log(forecastValue);
          
    
          // Pass necessary parameters to your backend endpoint (e.g. previousIncome, previousExpense, forecastValue)
          axiosClient.get("/deepseek-suggestion", {
            params: {
              previousIncome: previousMonthIncome,  // calculate or store these values in state
              previousExpense: previousMonthExpense,
              forecastValue: forecastValue,
            },
          })
          .then((res) => {
            setDeepseekSuggestion(res.data.suggestion);
          })
          .catch((err) => {
            console.error("Error fetching suggestion:", err);
            setDeepseekSuggestion("Failed to fetch suggestion.");
          })
          .finally(() => {
            setFetchingSuggestion(false);
          });
        })
        .catch((err) => {
          console.error("Error fetching income data:", err);
          setFetchingSuggestion(false);
        }
      );
    };
    
    

    return (
        <>
            <Section className="flex flex-col gap-4 p-4 bg-light-mint !w-full">
                <h1 className="text-big font-bold text-center">
                    Spending Forecast Monthly
                </h1>
                <div
                    className="size-full all-center shadow-lg rounded-lg m-auto"
                    style={{
                        position: "relative",
                        width: "80%",
                        height: "500px",
                        overflow: "hidden",  
                    }}
                >
                    <Line data={chartData} options={options} />
                </div>

                
            </Section>

            <section className="flex gap-4 mt-4 rounded-2xl shadow-xl">
                <div className="flex flex-col flex-[.6] p-4 rounded-2xl bg-light-mint gap-4">
                    <h2 className="text-medium sm:text-medium font-bold text-black py-3 rounded-xl">
                    AI-Based Budget Adjustment Suggestion
                    </h2>

                    
                    {!showSuggestion ? (
                    <div>
                        <button
                            onClick={fetchDeepseekSuggestion}
                            className="bg-dark-green text-white py-3 px-6 rounded-xl block shadow-lg transition duration-300 ease-in-out hover:scale-105 active:scale-95"
                            disabled={fetchingSuggestion}
                        >
                            {fetchingSuggestion ? (
                            <span className="flex items-center">
                                <LoadingEffect />
                                <span className="ml-2">Fetching Suggestion...</span>
                            </span>
                            ) : (
                            "Get AI Budget Suggestion"
                            )}
                        </button>
                    </div>
                    
                    ) : (
                    <div className="flex flex-col gap-6 rounded-xl">
                        {fetchingSuggestion ? (
                            <LoadingEffect />
                        ) : (
                        deepseekSuggestion.split("\n").map((line, index) => (
                            <div key={index} className="p-4 font-medium rounded-lg shadow-md flex items-center gap-2">
                                <LightbulbIcon color="success"/>
                                <p>{line}</p>
                            </div>
                        ))
                        )}
                    </div>
                    )}
                </div>
                <div className="flex flex-col flex-[.4] p-4 rounded-2xl bg-light-mint">
                    <h2 className="text-medium sm:text-medium font-bold text-black py-3 rounded-xl">Forecast Analysis</h2>

                    <div className="flex flex-col gap-6 rounded-xl shadow-md">

                        <div className="p-4 font-medium rounded-lg shadow-md flex gap-2">
                            {/* Conditional Icons */}
                            {forecast[forecast.length - 2] - historical.reduce((a, b) => a + b, 0) / historical.length > 
                            (historical.reduce((a, b) => a + b, 0) / historical.length) * 0.1 ? (
                                <ArrowUpwardIcon color="warning" />
                            ) : forecast[forecast.length - 2] - historical.reduce((a, b) => a + b, 0) / historical.length < 
                                (historical.reduce((a, b) => a + b, 0) / historical.length) * -0.1 ? (
                                <ArrowDownwardIcon color="success" />
                            ) : (
                                <ThumbUpAltIcon color="success" />
                            )}

                            {/* Conditional Text */}
                            <div>
                                {forecast[forecast.length - 2] - historical.reduce((a, b) => a + b, 0) / historical.length > 
                                (historical.reduce((a, b) => a + b, 0) / historical.length) * 0.1 ? (
                                    <>
                                        <h3>Spending Trend: Increasing</h3>
                                        <p>Your forecast indicates a significant increase in expenses. Consider reducing discretionary spending by about 10-15%.</p>
                                    </>
                                ) : forecast[forecast.length - 2] - historical.reduce((a, b) => a + b, 0) / historical.length < 
                                    (historical.reduce((a, b) => a + b, 0) / historical.length) * -0.1 ? (
                                    <>
                                        <h3>Spending Trend: Decreasing</h3>
                                        <p>Your forecast indicates a significant decrease in expenses. Keep up the good work and continue monitoring your budget.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3>Spending Trend: Balanced</h3>
                                        <p>Your spending appears stable. Keep monitoring your expenses and adjust if needed.</p>
                                    </>
                                )}
                            </div>
                        </div>

                        
                    </div>
                    
                </div>
                </section>

        </>
    );
}

export default Forecast;
