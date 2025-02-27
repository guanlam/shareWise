import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from "chart.js";
import iconMappings from "../icon-mappings"; // Import your icon mappings
import { yellow } from "@mui/material/colors";

// Register the required components
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

// Custom Plugin to display text in the center of the doughnut (if you want text like total)
const centerTextPlugin = {
  id: "centerText",
  afterDraw: (chart) => {
    const { ctx, chartArea, data } = chart;
    const { width, height, top, left } = chartArea;
    const centerX = width / 2 + left;
    const centerY = height / 2 + top;
    const totalExpense = data.datasets[0].data.reduce((sum, value) => sum + value, 0); // Calculate total expense

    // Text settings
    const fontSize = 16;
    ctx.save();
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "#333"; // Text color
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw total expense in the center
    ctx.fillText(`RM ${totalExpense.toFixed(2)}`, centerX, centerY);
    ctx.restore();
  },
};

const PieChart = ({ data }) => {
  const backgroundColors = data.map((item) => item.color || "#ccc");

  const chartData = {
    labels: data.map((item) => item.label), // Labels for the legend, not inside the chart
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map((color) => color + "CC"),
        borderWidth: 0,
      },
    ],
  };

  // Register the custom plugin if you need the total in the center (optional)
  Chart.register(centerTextPlugin);

  return (
    <div className="size-full flex flex-col justify-between items-center">
      {/* Container to control chart size */}
      <div className="w-[full] min-h-[40vh] flex justify-center items-center">
      <Doughnut
        data={chartData}
        options={{
          plugins: {
            tooltip: {
              enabled: true,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              titleColor: "#333",
              bodyColor: (tooltipItem) => {
                // Dynamically change the text color according to the category's color
                const index = tooltipItem.dataIndex; // Get the index of the category
                return chartData.datasets[0].backgroundColor[index]; // Get the category's color
              },
              // Use callbacks to customize the tooltip content
              callbacks: {
                // Modify the body of the tooltip to include "RM" before the value
                label: (tooltipItem) => {
                  const value = tooltipItem.raw; // Get the value of the current segment
                  return `RM ${value.toFixed(2)}`; // Prepend "RM" to the value
                },
              },
              
            },
            legend: {
              display: false,
            },
            datalabels: {
              display: false,
            },
          },
          cutout: '70%', // Adjust this for the hole size in the middle
          responsive: true,
          maintainAspectRatio: false,
        }}
      />


      </div>

      {/* Category Info Section (You can remove this if you don't want this section below the chart) */}
      <section className="mt-4 flex gap-4 size-full css-scrollbar-x">
        {data.map((category, index) => {
          const percentage = ((category.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(2);

          // Determine the appropriate icon component based on the category's icon name
          const IconComponent =
            (category.icon && iconMappings[category.icon]) ||
            iconMappings["Default"]; // Fallback to default icon

          return (
            <div key={index} className="rounded-xl all-center flex-col p-4 gap-2 bg-white min-w-[120px]">
              <div
                className="w-[2.5rem] h-[2.5rem] flex items-center justify-center rounded-xl"
                style={{ backgroundColor: category.color }}
              >
                {IconComponent ? (
                  <IconComponent className="text-white" />
                ) : (
                  <span className="text-white">?</span>
                )}
              </div>

              <h4 className="font-semibold whitespace-nowrap">{category.label}</h4>
              <p>{percentage}%</p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default PieChart;
