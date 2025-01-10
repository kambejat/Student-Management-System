import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const ExpensesChart: React.FC = () => {
    const [chartData] = useState({
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Expenses",
            data: [300, 500, 400, 600, 700],
            backgroundColor: "#008d7a",
          },
        ],
    })
  
  return <ReactApexChart options={chartData} type="bar" height={300} />;
};

export default ExpensesChart;
