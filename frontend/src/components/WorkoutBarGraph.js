import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const WorkoutBarGraph = ({ workoutCounts }) => {
  const data = {
    labels: Object.keys(workoutCounts),
    datasets: [
      {
        label: "Workout Count",
        data: Object.values(workoutCounts),
        backgroundColor: "#76c776",
        borderColor: "#4c8c4c",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return <Bar data={data} options={options} />;
};

export default WorkoutBarGraph;
