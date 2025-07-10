import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

function YearlyIncomeChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = { 
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: ["#ffd12e", "#ff7c1d", "#22C55E"],
          hoverBackgroundColor: ["#60A5FA", "#FCD34D", "#4ADE80"],
        },
      ],
    };
    const options = {
      cutout: "60%",
      responsive: true, 
      maintainAspectRatio: false,
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <>
      <Chart
        type="doughnut"
        data={chartData}
        options={chartOptions}
        className="w-full h-full"
      />
    </>
  );
}

export default YearlyIncomeChart;
