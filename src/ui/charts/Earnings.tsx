import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ChartData {
  x: number; // Timestamp
  y: number; // Value
}

const EarningChart: React.FC = () => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      id: "earnings-chart",
      type: "line",
      height: 300,
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "MMM dd, yyyy",
      },
      title: {
        text: "Date",
      },
    },
    yaxis: {
      title: {
        text: "Amount",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    legend: {
      position: "top",
    },
  });

  const [chartSeries, setChartSeries] = useState<{ name: string; data: ChartData[] }[]>([
    {
      name: "Collected Fees",
      data: [],
    },
    {
      name: "Total Collections",
      data: [],
    },
  ]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      const collectedFees: ChartData[] = [
        { x: new Date("2024-01-01").getTime(), y: 100 },
        { x: new Date("2024-01-02").getTime(), y: 120 },
        { x: new Date("2024-01-03").getTime(), y: 111 },
      ];

      const totalCollections: ChartData[] = [
        { x: new Date("2024-01-01").getTime(), y: 200 },
        { x: new Date("2024-01-02").getTime(), y: 220 },
        { x: new Date("2024-01-03").getTime(), y: 210 },
      ];

      // Set the chart data without filtering
      setChartSeries([
        {
          name: "Collected Fees",
          data: collectedFees,
        },
        {
          name: "Total Collections",
          data: totalCollections,
        },
      ]);
    };

    fetchEarningsData();
  }, []);

  return (
    <div className="flex-1 dark:text-white">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={300}
      />
    </div>
  );
};

export default EarningChart;
