# PermaLearn: A Decentralized Learning Journey

## Overview
PermaLearn is a cutting-edge, decentralized application designed to track and celebrate your learning achievements with a twist of futuristic flair. Built on April 11, 2025, by [yourusername], it combines blockchain permanence with a jaw-dropping 3D user interface, making it a standout tool for learners worldwide. Whether you’re mastering HTML or diving into advanced blockchain development, PermaLearn ensures your progress is securely stored, beautifully displayed, and smartly guided with personalized recommendations.

### Why It’s Special
PermaLearn isn’t just another learning tracker—it’s a unique blend of technology and design that sets it apart:
- **Permanent Blockchain Storage**: Your achievements are etched into the Arweave blockchain, ensuring they’re tamper-proof and accessible forever—no server, no central authority.
- **Mind-Blowing Design**: A 3D animated gradient background, neon glow effects, and floating cards with hover animations create an immersive, sci-fi-inspired experience.
- **Smart Recommendations**: A sophisticated algorithm analyzes your completed courses, suggests prerequisites if needed, and offers dynamic next steps—never repetitive, always relevant.
- **Local Persistence**: Records stay in your browser’s `localStorage`, surviving refreshes without extra infrastructure.
- **Decentralized Flexibility**: Works locally with Arlocal for testing and scales to `arweave.net` for real-world use, all client-side.

### What It Does
PermaLearn empowers you to:
1. **Track Achievements**: Add courses you’ve completed (e.g., “HTML Basics”) with a timestamp, stored on Arweave.
2. **Manage Records**: Delete records locally if you want them hidden (they remain on Arweave due to its immutability).
3. **Get Inspired**: Receive tailored course suggestions based on your progress, from foundational skills to advanced topics.
4. **View Proof**: Access blockchain transaction links (e.g., `https://arweave.net/[txId]`) to verify your records.
5. **Enjoy the Experience**: Interact with a visually stunning interface that makes learning feel like a galactic adventure.

## Features in Detail
- **Sign In/Sign Up**: Upload an Arweave wallet file (JSON key) to authenticate and tie records to your address.
- **Add Achievement**: Input a course name, sign a transaction with your wallet, and post it to Arweave—records appear instantly in the UI.
- **Delete Option**: Remove records from the UI and `localStorage` with a sleek “Delete” button (blockchain data persists).
- **Recommendations**: A dynamic system:
  - No records? Suggests “Begin with HTML Basics!”
  - Completed “HTML Basics”? Offers “CSS Basics” or “JavaScript Basics.”
  - Mastered basics? Randomizes advanced picks like “Explore Python for Data Science” or “Build a Blockchain with Solidity.”
  - Checks prerequisites (e.g., suggests “JavaScript Basics” before “React Basics”).
- **Persistent UI**: Records reload from `localStorage` on refresh, paired with Arweave data fetches.
- **Visual Proof**: Links to Arweave transactions for transparency and bragging rights.

## Technology Stack
PermaLearn leverages a modern, lightweight stack:
- **Frontend**:
  - **React**: v18.x for dynamic, component-based UI (via `create-react-app`).
  - **CSS Modules**: Scoped styles in `App.module.css` for the 3D design, animations, and neon effects.
  - **JavaScript (ES6+)**: Powers logic, state management (`useState`, `useEffect`), and Arweave integration.
- **Blockchain**:
  - **Arweave**: Decentralized storage via `arweave-js` (`npm install arweave`).
    - Local: Arlocal (`localhost:1984`) for testing.
    - Production: `arweave.net` for permanent storage.
- **Typography**:
  - **Orbitron Font**: Futuristic Google Font (`https://fonts.googleapis.com/css2?family=Orbitron`) for headers and text.
- **Development Tools**:
  - **Node.js**: v14+ runtime (`npm` for package management).
  - **Git**: Version control (`git init`, `git push`).
  - **gh-pages**: Deployment tool for GitHub Pages (`npm install --save-dev gh-pages`).
- **Dependencies** (from `package.json`):
  - `arweave`: Blockchain integration.
  - `react`, `react-dom`, `react-scripts`: Core React setup.
  - `gh-pages`: Deployment script.

## Prerequisites
- Node.js (v16+): [Download](https://nodejs.org/)
- Git: [Download](https://git-scm.com/)
- Arweave wallet JSON file: Generate at [arweave.app](https://arweave.app/)

## Setup
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Adwaitbytes/perma-learn.git
   cd perma-learn