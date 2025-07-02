import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import JournalForm from "./JournalForm";
import MoodDisplay from "./MoodDisplay";
import Signup from "./Signup";
import Login from "./Login";
import "./App.css";
import MoodDashboard from "./MoodDashboard";
import ChatSidebar from './components/assistant/ChatSidebar';
import StatCards from './components/StatCards';


// Helper to get pastel card color class
function getCardColor(idx) {
  if (idx % 4 === 0) return "red";
  if (idx % 4 === 1) return "yellow";
  if (idx % 4 === 2) return "green";
  return "white";
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [mood, setMood] = useState(null);
  const [message, setMessage] = useState(null);
  const [sentimentScore, setSentimentScore] = useState(null);
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all journal entries on mount
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5050/api/journal", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]);
        }
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setEntries([]);
      });
  }, [token]);

  // Handle new journal entry submission
  const handleNewEntry = async (content) => {
    try {
      const params = new URLSearchParams({ prompt: content });
      const moodRes = await fetch(`http://localhost:5050/api/mood?${params.toString()}`);
      const moodData = await moodRes.json();

      setMood(moodData.mood);
      setMessage(moodData.message);
      setSentimentScore(moodData.sentimentScore);

      const entryRes = await fetch("http://localhost:5050/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          mood: moodData.mood,
          message: moodData.message,
          sentimentScore: moodData.sentimentScore,
        }),
      });

      if (!entryRes.ok) throw new Error("Failed to create entry");

      const newEntry = await entryRes.json();
      setEntries((prev) => (Array.isArray(prev) ? [newEntry, ...prev] : [newEntry]));
      setPage(0);
      setFlip(true);
      setTimeout(() => setFlip(false), 700);
    } catch (err) {
      console.error("Error adding entry:", err);
    }
  };

  // Delete journal entry
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journal entry?")) return;
    try {
      const response = await fetch(`http://localhost:5050/api/journal/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEntries((prev) => {
          const newEntries = prev.filter((e) => e._id !== id);
          if (page >= newEntries.length && newEntries.length > 0) {
            setPage(newEntries.length - 1);
          }
          return newEntries;
        });
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  // Page flip controls
  const prevPage = () => {
    if (page < entries.length - 1) {
      setFlip(true);
      setTimeout(() => {
        setPage(page + 1);
        setFlip(false);
      }, 350);
    }
  };

  const nextPage = () => {
    if (page > 0) {
      setFlip(true);
      setTimeout(() => {
        setPage(page - 1);
        setFlip(false);
      }, 350);
    }
  };

  const currentEntry = entries[page];

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <StatCards />
              <div className="container">
                <JournalForm onSubmit={handleNewEntry} />
                {message && <MoodDisplay mood={mood} message={message} />}
                <h2 style={{ textAlign: "center", color: "#222", marginBottom: "1.5rem" }}>My Journal</h2>
                <div className="page-controls">
                  <button className="page-btn" onClick={prevPage} disabled={page >= entries.length - 1}>
                    Previous
                  </button>
                  <span style={{ alignSelf: "center", color: "#c9a3f9" }}>
                    Page {entries.length ? entries.length - page : 0} / {entries.length}
                  </span>
                  <button className="page-btn" onClick={nextPage} disabled={page === 0}>
                    Next
                  </button>
                </div>
                {currentEntry ? (
                  <div className={`journal-card ${getCardColor(page)}${flip ? " page-flip" : ""}`}>
                    <button
                      className="journal-delete-btn"
                      title="Delete this entry"
                      onClick={() => handleDelete(currentEntry._id)}
                    >
                      🗑️
                    </button>
                    <div className="journal-date">
                      {new Date(currentEntry.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="journal-content">{currentEntry.content}</div>
                    <div className="journal-meta">
                      <span className="journal-mood">Mood: {currentEntry.mood || "—"}</span>
                      {currentEntry.productivity && (
                        <span className="journal-productivity">
                          Productivity Level: {currentEntry.productivity}
                        </span>
                      )}
                    </div>
                    {currentEntry.message && (
                      <div className="entry-message" style={{ marginTop: "0.7rem" }}>
                        {currentEntry.message}
                      </div>
                    )}
                    {typeof currentEntry.sentimentScore === "number" && (
                      <div
                        className="journal-sentiment"
                        style={{ marginTop: "0.5rem", fontSize: "0.9rem", fontStyle: "italic", color: "#555" }}
                      >
                        Sentiment Score: {currentEntry.sentimentScore.toFixed(2)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#c9a3f9" }}>No entries yet.</div>
                )}
              </div>
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MoodDashboard />} />
      </Routes>
      <ChatSidebar />
      <footer className="footer">
        &copy; {new Date().getFullYear()} Journal Buddy. All rights reserved.
      </footer>
    </div>
  );
}
