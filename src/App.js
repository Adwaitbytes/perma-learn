import React, { useState, useEffect } from "react";
import Arweave from "arweave";
import styles from "./App.module.css";

const arweave = Arweave.init({
  host: "localhost",
  port: 1984,
  protocol: "http",
  timeout: 20000,
  logging: true,
});

function App() {
  const [records, setRecords] = useState([]);
  const [course, setCourse] = useState("");
  const [recommendation, setRecommendation] = useState("No recommendation yet");
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletFile, setWalletFile] = useState(null);

  useEffect(() => {
    if (wallet) {
      const getAddress = async () => {
        const address = await arweave.wallets.jwkToAddress(wallet);
        setWalletAddress(address);
      };
      getAddress();
    }
  }, [wallet]);

  useEffect(() => {
    const loadRecords = async () => {
      if (!walletAddress) return;
      try {
        console.log("Fetching records for:", walletAddress);
        const storedTxIds = JSON.parse(localStorage.getItem(`permaLearn_${walletAddress}`)) || [];
        const fetchedRecords = [];
        for (const txId of storedTxIds) {
          try {
            const tx = await arweave.transactions.get(txId);
            const tags = tx.get("tags").reduce((acc, tag) => {
              acc[tag.get("name", { decode: true, string: true })] = tag.get("value", { decode: true, string: true });
              return acc;
            }, {});
            if (
              tags["App-Name"] === "PermaLearn" &&
              tags["User-Address"] === walletAddress
            ) {
              const data = JSON.parse(tx.get("data", { decode: true, string: true }));
              fetchedRecords.push({ ...data, txId });
            }
          } catch (err) {
            console.warn(`Skipping invalid TxID: ${txId}`, err);
          }
        }
        setRecords(fetchedRecords);
        console.log("Records loaded:", fetchedRecords);
      } catch (error) {
        console.error("Error loading records:", error);
        alert("Failed to load records. Check console for details.");
      }
    };
    loadRecords();
  }, [walletAddress]);

  const getRecommendation = () => {
    if (records.length === 0) {
      return "Begin your adventure with HTML Basics!";
    }

    const completedCourses = records.map(record => record.name.toLowerCase());

    // Define course categories and prerequisites
    const courseMap = {
      "html basics": { next: ["CSS Basics", "JavaScript Basics"] },
      "css basics": { prereq: ["html basics"], next: ["JavaScript Basics", "Tailwind CSS"] },
      "javascript basics": { prereq: ["html basics", "css basics"], next: ["React Basics", "Node.js Basics"] },
      "react basics": { prereq: ["javascript basics"], next: ["Redux", "TypeScript"] },
      "node.js basics": { prereq: ["javascript basics"], next: ["Express.js", "GraphQL"] },
      "tailwind css": { prereq: ["css basics"], next: ["Advanced Web Design"] },
      "redux": { prereq: ["react basics"], next: ["Advanced React Patterns"] },
      "typescript": { prereq: ["javascript basics"], next: ["Advanced TypeScript"] },
      "express.js": { prereq: ["node.js basics"], next: ["REST API Design"] },
      "graphql": { prereq: ["node.js basics"], next: ["Apollo Client"] },
      "advanced web design": { prereq: ["tailwind css"], next: ["UI/UX Principles"] },
      "advanced react patterns": { prereq: ["redux"], next: ["React Native"] },
      "advanced typescript": { prereq: ["typescript"], next: ["Type-Safe APIs"] },
      "rest api design": { prereq: ["express.js"], next: ["Microservices"] },
      "apollo client": { prereq: ["graphql"], next: ["Full-Stack GraphQL"] },
    };

    // Check for missing prerequisites
    for (const [course, { prereq }] of Object.entries(courseMap)) {
      if (prereq && !completedCourses.includes(course)) {
        const missing = prereq.find(p => !completedCourses.includes(p));
        if (missing) {
          return `Before tackling more, try ${missing.charAt(0).toUpperCase() + missing.slice(1)}!`;
        }
      }
    }

    // Suggest next steps based on completed courses
    const possibleNext = new Set();
    completedCourses.forEach(comp => {
      const nextCourses = courseMap[comp]?.next || [];
      nextCourses.forEach(next => {
        if (!completedCourses.includes(next.toLowerCase())) {
          possibleNext.add(next);
        }
      });
    });

    if (possibleNext.size > 0) {
      const nextArray = Array.from(possibleNext);
      const randomNext = nextArray[Math.floor(Math.random() * nextArray.length)];
      return `Level up with ${randomNext}!`;
    }

    // Fallback advanced suggestions
    const advancedOptions = [
      "Explore Python for Data Science",
      "Master DevOps with Docker",
      "Build a Blockchain with Solidity",
      "Dive into Machine Learning Basics",
      "Create Games with Unity",
    ];
    const randomIndex = Math.floor(Math.random() * advancedOptions.length);
    return advancedOptions[randomIndex];
  };

  useEffect(() => {
    setRecommendation(getRecommendation());
  }, [records]);

  const handleWalletUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const walletData = JSON.parse(event.target.result);
          setWallet(walletData);
          setWalletFile(file);
          console.log("Wallet loaded successfully");
        } catch (error) {
          alert("Invalid wallet file!");
          console.error("Wallet parse error:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const addRecord = async () => {
    if (!wallet) {
      alert("Please sign in with your wallet first!");
      return;
    }
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
        { data: JSON.stringify(newRecord) },
        wallet
      );
      transaction.addTag("App-Name", "PermaLearn");
      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("User-Address", walletAddress);
      console.log("Signing transaction...");
      await arweave.transactions.sign(transaction, wallet);
      console.log("Posting transaction to Arlocal...");
      const response = await arweave.transactions.post(transaction);
      console.log("Response from Arlocal:", response.status, response.statusText);
      if (response.status === 200) {
        const updatedRecords = [
          ...records,
          { ...newRecord, txId: transaction.id },
        ];
        setRecords(updatedRecords);
        const storedTxIds = JSON.parse(localStorage.getItem(`permaLearn_${walletAddress}`)) || [];
        storedTxIds.push(transaction.id);
        localStorage.setItem(`permaLearn_${walletAddress}`, JSON.stringify(storedTxIds));
        setCourse("");
        console.log("Record saved! Transaction ID:", transaction.id);
      } else {
        alert(`Failed to save to Arweave. Status: ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error("Error saving to Arweave:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  const deleteRecord = (txId) => {
    const updatedRecords = records.filter(record => record.txId !== txId);
    setRecords(updatedRecords);
    const storedTxIds = JSON.parse(localStorage.getItem(`permaLearn_${walletAddress}`)) || [];
    const updatedTxIds = storedTxIds.filter(id => id !== txId);
    localStorage.setItem(`permaLearn_${walletAddress}`, JSON.stringify(updatedTxIds));
    console.log("Record deleted:", txId);
  };

  const signOut = () => {
    setWallet(null);
    setWalletAddress("");
    setRecords([]);
    setWalletFile(null);
    console.log("Signed out");
  };

  return (
    <div className={styles.app}>
      <div className={styles.background}></div>
      <h1 className={styles.header}>PermaLearn</h1>

      {!wallet ? (
        <div className={styles.loginContainer}>
          <h2>Sign In / Sign Up</h2>
          <p>Upload your Arweave wallet file to begin your epic learning adventure.</p>
          <input
            type="file"
            accept=".json"
            onChange={handleWalletUpload}
            className={styles.fileInput}
          />
        </div>
      ) : (
        <>
          <div className={styles.userInfo}>
            <p>Logged in as: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            <button onClick={signOut} className={styles.signOutButton}>
              Sign Out
            </button>
          </div>

          <div className={styles.formContainer}>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Enter course name"
              className={styles.input}
            />
            <button onClick={addRecord} className={styles.button}>
              Add Achievement
            </button>
          </div>

          <div className={styles.recordsContainer}>
            <h2 className={styles.subHeader}>Your Learning Journey</h2>
            {records.length === 0 ? (
              <p className={styles.emptyText}>No achievements yet. Embark on your quest!</p>
            ) : (
              <ul className={styles.recordsList}>
                {records.map((record, index) => (
                  <li key={index} className={styles.recordItem}>
                    <span className={styles.recordName}>{record.name}</span>
                    <div>
                      <span className={styles.recordDate}>{record.date}</span>
                      {record.txId && (
                        <>
                          <a
                            href={`http://localhost:1984/${record.txId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.txLink}
                          >
                            View Proof
                          </a>
                          <button
                            onClick={() => deleteRecord(record.txId)}
                            className={styles.deleteButton}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.recommendationsContainer}>
            <h2 className={styles.subHeader}>Your Next Challenge</h2>
            <p className={styles.recommendationText}>{recommendation}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;