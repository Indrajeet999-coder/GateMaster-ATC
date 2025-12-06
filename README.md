# ✈️ GateMaster - Smart ATC Gate Assignment System

**GateMaster** is a real-time Air Traffic Control (ATC) dashboard that automates airport gate assignments. It uses a **Priority Queue (Min-Heap)** data structure to efficiently allocate the nearest available gate to incoming flights, optimizing airport operations.

![Project Screenshot](screenshot.png)


## 🚀 Features

* **Smart Scheduling:** Uses a **Min-Heap Algorithm** to find the soonest available gate in $O(\log n)$ time.
* **Real-Time Queueing:** Automatically stacks flights if a gate is currently busy.
* **ATC Interface:** Designed with a "Dark Mode" radar terminal aesthetic for realism.
* **Live UTC Clock:** synchronized with global aviation time standards.
* **Responsive Design:** Fully functional on desktop and mobile devices.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Data Structure:** Custom Min-Heap Implementation (Priority Queue)

## ⚙️ How It Works (The Logic)

1.  **Priority Queue:** All gates are stored in a Min-Heap based on their `nextAvailableTime`.
2.  **Assignment:** When a flight is entered, the system `extractsMin()` (gets the root node) to find the gate with the earliest free time.
3.  **Time Management:**
    * If the gate is **Free**, the new flight starts immediately.
    * If the gate is **Busy**, the new flight is scheduled to start *after* the current one finishes.
4.  **Re-Insertion:** The gate is updated with the new time and re-inserted into the Heap.

## 📦 How to Run Locally

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Indrajeet999-coder/GateMaster-ATC.git](https://github.com/Indrajeet999-coder/GateMaster-ATC.git)
    cd GateMaster-ATC
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Server:**
    ```bash
    node server.js
    ```

4.  **Open in Browser:**
    Visit `http://localhost:3000`

---
*Created by Indrajeet Singh*