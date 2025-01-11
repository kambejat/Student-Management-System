import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ExpensesChart: React.FC = () => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      id: "expenses-chart",
      type: "bar",
      height: 300,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May"],
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Expenses",
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008d7a"],
  });

  const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: "Expenses",
      data: [],
    },
  ]);

  useEffect(() => {
    // Simulated data fetching and processing
    const fetchExpensesData = async () => {
      const data = [300, 500, 400, 600, 700]; // Simulated expense data

      setChartSeries([
        {
          name: "Expenses",
          data: data,
        },
      ]);
    };

    fetchExpensesData();
  }, []);

  return (
    <div className="flex-1 dark:text-white">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={300}
      />
    </div>
  );
};

export default ExpensesChart;
