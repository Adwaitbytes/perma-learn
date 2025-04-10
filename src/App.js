import React, { useState, useEffect } from "react";
import Arweave from "arweave";
import wallet from "./arweave-keyfile.json";
import styles from "./App.module.css";

const arweave = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
  timeout: 20000,
  logging: true,
});

// Mock AO process ID (replace with real ID if spawned)
const AO_PROCESS_ID = "mock-ao-process-id";

function App() {
  const [records, setRecords] = useState([]);
  const [course, setCourse] = useState("");
  const [recommendation, setRecommendation] = useState("Loading...");

  // Fetch recommendation from AO
  const fetchRecommendation = async () => {
    try {
      // Simulate AO call (replace with real AO SDK call when available)
      const result = await mockAORecommend(records);
      setRecommendation(result);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setRecommendation("Failed to load recommendation.");
    }
  };

  // Mock AO function (simulates Lua logic)
  const mockAORecommend = async (records) => {
    if (records.length === 0) return "No recommendation yet";
    const lastCourse = records[records.length - 1].name;
    if (lastCourse.includes("HTML")) return "Try CSS Basics next!";
    if (lastCourse.includes("CSS")) return "Try JavaScript Basics next!";
    if (lastCourse.includes("JavaScript")) return "Try React Basics next!";
    if (lastCourse.includes("React")) return "Try Node.js Basics next!";
    return "Keep exploring advanced topics!";
  };

  // Update recommendation when records change
  useEffect(() => {
    fetchRecommendation();
  }, [records]);

  const addRecord = async () => {
    if (!course.trim()) {
      alert("Please enter a course name!");
      return;
    }

    const newRecord = {
      name: course.trim(),
      date: new Date().toLocaleString(),
    };

    try {
      console.log("Creating transaction...");
      const transaction = await arweave.createTransaction(
        {
          data: JSON.stringify(newRecord),
        },
        wallet
      );
      transaction.addTag("App-Name", "PermaLearn");
      transaction.addTag("Content-Type", "application/json");

      console.log("Signing transaction...");
      await arweave.transactions.sign(transaction, wallet);

      console.log("Posting transaction to Arlocal...");
      const response = await arweave.transactions.post(transaction);

      console.log("Response from Arlocal:", response.status, response.statusText);
      if (response.status === 200) {
        setRecords((prevRecords) => [
          ...prevRecords,
          { ...newRecord, txId: transaction.id },
        ]);
        setCourse("");
        console.log("Record saved! Transaction ID:", transaction.id);
      } else {
        alert(`Failed to save to Arweave. Status: ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error("Error saving to Arweave:", error);
      alert("Something went wrong. Check the console for details.");
    }
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.header}>PermaLearn</h1>

      <div className={styles.formContainer}>
        <input
          type="text"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          placeholder="Enter course name"
          className={styles.input}
        />
        <button onClick={addRecord} className={styles.button}>
          Add
        </button>
      </div>

      <div className={styles.recordsContainer}>
        <h2 className={styles.subHeader}>Your Learning Records</h2>
        {records.length === 0 ? (
          <p className={styles.emptyText}>No records yet. Start learning!</p>
        ) : (
          <ul className={styles.recordsList}>
            {records.map((record, index) => (
              <li key={index} className={styles.recordItem}>
                <span className={styles.recordName}>{record.name}</span>
                <div>
                  <span className={styles.recordDate}>{record.date}</span>
                  {record.txId && (
                    <a
                      href={`http://localhost:1984/${record.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.txLink}
                    >
                      View Locally
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.recommendationsContainer}>
        <h2 className={styles.subHeader}>Recommendations</h2>
        <p className={styles.emptyText}>{recommendation}</p>
      </div>
    </div>
  );
}

export default App;