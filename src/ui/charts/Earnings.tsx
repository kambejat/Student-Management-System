import React from "react";
import ReactApexChart from "react-apexcharts";

const EarningChart: React.FC = () => {
  const chartData = {
    options: {
      chart: {
        type: "line",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
      colors: ["#f93a53"], // Customize color for line
    },
    series: [
      {
        name: "Expenses",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
  };

  return (
    <>
     
      <ReactApexChart
        options={chartData}
        type="line"
        height={300}
      />
    </>
  );
};

export default EarningChart;
