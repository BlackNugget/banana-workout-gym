import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutBarGraph from "../components/WorkoutBarGraph";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();


  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title"); 
  const [filterOption, setFilterOption] = useState("all"); 
  const [orderOption, setOrderOption] = useState("asc"); 

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`);
      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };
    fetchWorkouts();
  }, [dispatch]);


  const filteredWorkouts = workouts
    ? workouts
        .filter((workout) =>
          workout.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((workout) => {
          if (filterOption === "all") return true;
          if (filterOption === "below15") return workout.load <= 15;
          if (filterOption === "above15") return workout.load > 15;
          return true;
        })
        .sort((a, b) => {
          let comparison = 0;
          if (sortOption === "title") {
            comparison = a.title.localeCompare(b.title);
          } else if (sortOption === "load") {
            comparison = a.load - b.load;
          } else if (sortOption === "reps") {
            comparison = a.reps - b.reps;
          }
          return orderOption === "asc" ? comparison : -comparison;
        })
    : [];


  const workoutCounts = workouts
    ? workouts.reduce((acc, workout) => {
        acc[workout.title] = (acc[workout.title] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="home">

      <div className="controls">
        <input
          type="text"
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          onChange={(e) => setSortOption(e.target.value)}
          className="dropdown light-green"
        >
          <option value="title">Sort by Title</option>
          <option value="load">Sort by Load</option>
          <option value="reps">Sort by Reps</option>
        </select>

        <select
          onChange={(e) => setFilterOption(e.target.value)}
          className="dropdown light-green"
        >
          <option value="all">Show All</option>
          <option value="below15">0 to 15kg</option>
          <option value="above15">Above 15kg</option>
        </select>

        <select
          onChange={(e) => setOrderOption(e.target.value)}
          className="dropdown light-green"
        >
          <option value="asc">Ascending Order</option>
          <option value="desc">Descending Order</option>
        </select>
      </div>


      <div className="main-content">
        <div className="workouts-display">
          <div className="workouts">
            {filteredWorkouts.map((workout) => (
              <WorkoutDetails workout={workout} key={workout._id} />
            ))}
          </div>
        </div>
        <WorkoutForm />
      </div>


      <div className="data-section">
        <div className="workout-count">
          <h3>Workout Counts</h3>
          <ul>
            {Object.entries(workoutCounts).map(([title, count]) => (
              <li key={title}>
                {title}: {count}
              </li>
            ))}
          </ul>
        </div>
        <div className="workout-graph">
          <WorkoutBarGraph workoutCounts={workoutCounts} />
        </div>
      </div>
    </div>
  );
};

export default Home;
