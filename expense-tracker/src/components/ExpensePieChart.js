import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register the necessary elements and plugin with Chart.js
Chart.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function ExpensePieChart({ expenses }) {
  // Calculate the total amount spent per category
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  // Prepare the data for the pie chart
  const data = {
    labels: Object.keys(categoryTotals), // Categories as labels
    datasets: [
      {
        data: Object.values(categoryTotals), // Totals as data points
        backgroundColor: [
          '#FF6384', // Colors for the pie slices
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  // Configure the options to display percentages with clear and big text
  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (context.parsed) {
              label += `: ${context.parsed.toFixed(2)}`;
            }
            return label;
          }
        }
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.getDatasetMeta(0).total;
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: '#fff',
        font: {
          size: 16, // Increase font size
          weight: 'bold', // Optional: make text bold
        },
        padding: {
          top: 10,
        },
        display: true,
      },
    },
  };

  return (
    <div className="mb-4 d-flex justify-content-center pieChart">
      <div > 
        <h3 className="text-center">Expenses by Category</h3>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default ExpensePieChart;
