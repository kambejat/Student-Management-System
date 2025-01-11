import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const StudentsChart: React.FC = () => {
  const [chartOptions, setChartOptions] = useState<ApexOptions>({
    chart: {
      id: "students-chart",
      type: "pie",
      height: 300,
    },
    labels: ["2019", "2020", "2021"],
    dataLabels: {
      enabled: true,
    },
    colors: ["#f93a53", "#008d7a", "#53c4ff"],
  });

  const [chartSeries, setChartSeries] = useState<number[]>([]);

  useEffect(() => {
    // Simulated data fetching and processing
    const fetchStudentsData = async () => {
      const data = [100, 120, 150]; // Simulated students data

      setChartSeries(data);
    };

    fetchStudentsData();
  }, []);

  return (
    <div className="flex-1 dark:text-white">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        height={300}
      />
    </div>
  );
};

export default StudentsChart;
