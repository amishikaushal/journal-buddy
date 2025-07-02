import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TagCloud } from "react-tagcloud";
import { useNavigate } from "react-router-dom";

const MoodDashboard = () => {
  const [moodData, setMoodData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5050/api/journal/analytics", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMoodData(data.moodHistory || []);
        setTagData(data.tagCloud || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch mood dashboard data:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return (
      <div className="error-message" style={{ color: "red", textAlign: "center", padding: "2rem" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#6a42ff" }}>Mood History Dashboard</h2>

      {/* Mood Over Time Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sentimentScore" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tag Cloud */}
      <h3 style={{ marginTop: "3rem", textAlign: "center", color: "#6a42ff" }}>Frequent Words</h3>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <TagCloud minSize={12} maxSize={35} tags={tagData} />
      </div>
    </div>
  );
};

export default MoodDashboard;
