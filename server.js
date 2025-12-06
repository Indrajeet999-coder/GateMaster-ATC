const express = require('express');
const bodyParser = require('body-parser');
const PriorityQueue = require('./PriorityQueue');

const app = express();
// It must check 'process.env.PORT' first!
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize PriorityQueue with 5 gates
const gateQueue = new PriorityQueue();

// Add initial gates with different nextAvailableTime
// Some busy (future time), some free (past/current time)
const now = new Date();
const gates = [
  { gateId: 'A1', nextAvailableTime: new Date(now.getTime() - 10 * 60000), flightNo: null }, // Free (10 min ago)
  { gateId: 'A2', nextAvailableTime: new Date(now.getTime() + 3 * 60000), flightNo: 'UA-500' },  // Busy (3 min from now)
  { gateId: 'B1', nextAvailableTime: new Date(now.getTime() - 5 * 60000), flightNo: null },  // Free (5 min ago)
  { gateId: 'B2', nextAvailableTime: new Date(now.getTime() + 8 * 60000), flightNo: 'DL-123' },  // Busy (8 min from now)
  { gateId: 'C1', nextAvailableTime: new Date(now.getTime()), flightNo: null }                // Free (now)
];

gates.forEach(gate => {
  gateQueue.insert(gate);
});

// GET /api/status - Return current state of gates
app.get('/api/status', (req, res) => {
  try {
    const gates = gateQueue.getAll();
    res.json({ gates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get gate status' });
  }
});

// POST /api/assign-gate - Assign a gate to a flight
app.post('/api/assign-gate', (req, res) => {
  try {
    const { flightNo, aircraftSize } = req.body;

    if (!flightNo) {
      return res.status(400).json({ error: 'flightNo is required' });
    }

    // Convert to uppercase for consistency
    const normalizedFlightNo = flightNo.toUpperCase().trim();

    // Flight Format Validation: 2-3 letters, optional dash, 3-4 numbers
    const flightPattern = /^[A-Z]{2,3}-?\d{3,4}$/;
    if (!flightPattern.test(normalizedFlightNo)) {
      return res.status(400).json({ error: 'Invalid Flight Format' });
    }

    // Duplicate Flight Check: Check if flight is already assigned
    const existingGates = gateQueue.getAll();
    const isDuplicate = existingGates.some(gate => 
      gate.flightNo && gate.flightNo.toUpperCase() === normalizedFlightNo
    );
    
    if (isDuplicate) {
      return res.status(400).json({ error: 'Flight is already assigned to a gate!' });
    }

    // Extract the gate with minimum nextAvailableTime
    const assignedGate = gateQueue.extractMin();

    if (!assignedGate) {
      return res.status(503).json({ error: 'No gates available' });
    }

    // Update nextAvailableTime by adding 5 minutes
    // Use Math.max to ensure free gates start NOW, busy gates queue AFTER current flight
    const startTime = Math.max(Date.now(), assignedGate.nextAvailableTime.getTime());
    const newAvailableTime = new Date(startTime + 5 * 60000);
    assignedGate.nextAvailableTime = newAvailableTime;
    assignedGate.flightNo = normalizedFlightNo; // Use normalized (uppercase) flight number
    assignedGate.aircraftSize = aircraftSize || 'Medium';

    // Insert the gate back into the queue
    gateQueue.insert(assignedGate);

    res.json({
      success: true,
      gate: {
        gateId: assignedGate.gateId,
        nextAvailableTime: assignedGate.nextAvailableTime,
        flightNo: assignedGate.flightNo
      }
    });
  } catch (error) {
    console.error('Error assigning gate:', error);
    res.status(500).json({ error: 'Failed to assign gate: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`GateMaster server running on http://localhost:${PORT}`);
});
