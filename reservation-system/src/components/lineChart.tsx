import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "./authContext";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ReservationChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const { reservations } = useAuth();

  useEffect(() => {
    if (!reservations) return;

    // Count reservations per day
    const reservationCount: { [date: string]: number } = {};

    reservations.forEach((res) => {
      const date = res.reservationDate.split("T")[0]; // Extract YYYY-MM-DD
      reservationCount[date] = (reservationCount[date] || 0) + 1;
    });

    // Prepare data for chart
    const labels = Object.keys(reservationCount).sort(); // Dates
    const values = labels.map((date) => reservationCount[date]); // Count per date

    setChartData({
      labels,
      datasets: [
        {
          label: "Reservations Per Day",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    });
  }, [reservations]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Reservation Activity",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            return tooltipItems[0].label;
          },
          label: (context: any) => {
            return `Reservations: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Reservations",
        },
        ticks: {
          precision: 0, // Only show whole numbers
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };
  return (
    <div className="chart-container">
      <h2>Reservations By Month</h2>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ReservationChart;
