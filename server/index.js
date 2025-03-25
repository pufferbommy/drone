const express = require('express');
const cors = require('cors');
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;
const DRONE_CONFIG_SERVER_URL = "https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec"
const DRONE_LOG_SERVER_URL = "https://app-tracking.pockethost.io/api/collections/drone_logs/records"

app.use(express.json());
app.use(cors());

const droneService = {
  async getAllDrones () {
    const response = await fetch(DRONE_CONFIG_SERVER_URL)
    const { data } = await response.json()
    return data
  },
  async getDroneById(droneId) {
    const allDrones = await droneService.getAllDrones();
    return allDrones.find(d => d.drone_id === droneId);
  },
  async getDroneLogs(droneId) {
    const url = `${DRONE_LOG_SERVER_URL}?filter=(drone_id='${droneId}')&sort=-created&perPage=25`;
    const response = await fetch(url)
    const { items } = await response.json()
    return items  
  },
  async createDroneLog(logData) {
    const response = await fetch(DRONE_LOG_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer 20250301efx" },
      body: JSON.stringify(logData),
    });
    return response.json();
  }
}

app.get('/', (_, res) => res.status(200).json({ message: 'Server is running' }));

app.get('/configs/:droneId', async (req, res) => {
  const droneId = parseInt(req.params.droneId);

  if (isNaN(droneId)) return res.status(400).json({ message: 'Invalid drone ID' });

  try {
    const drone = await droneService.getDroneById(droneId);

    if (!drone) return res.status(404).json({ message: 'Drone not found' });

    res.status(200).json({
      drone_id: drone.drone_id,
      drone_name: drone.drone_name,
      light: drone.light,
      country: drone.country,
      weight: drone.weight,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/status/:droneId', async (req, res) => {
  const droneId = parseInt(req.params.droneId);

  if (isNaN(droneId)) return res.status(400).json({ message: 'Invalid drone ID' });

  try {
    const drone = await droneService.getDroneById(droneId);

    if (!drone) return res.status(404).json({ message: 'Drone not found' });

    res.status(200).json({ condition: drone.condition });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/logs/:droneId', async (req, res) => {
  const droneId = parseInt(req.params.droneId);

  if (isNaN(droneId)) return res.status(400).json({ message: 'Invalid drone ID' });

  try {
    const logs = await droneService.getDroneLogs(droneId);

    res.status(200).json(
      logs.map(log => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logs', async (req, res) => {
  try {
    const result = await droneService.createDroneLog(req.body);
    
    if(result.code === 400) return res.status(400).json({ message: result.message });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((_, res) => res.status(404).json({ message: 'Not found' }));

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));