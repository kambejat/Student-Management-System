import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

const StudentsChart: React.FC = () => {
  const [chartData] = useState({
    labels: ["2019", "2020", "2021"],
    datasets: [
      {
        label: "Students",
        data: [100, 120],
        backgroundColor: ["#f93a53", "#008d7a", "#53c4ff"],
        borderWidth: 1,
      },
    ],
  });

  return <ReactApexChart options={chartData} type="pie" height={300} />;
};

export default StudentsChart;
