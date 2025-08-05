import fs from 'fs';
import path from 'path';

const ADMIN_PIN = '0255'; // Your admin pin

const validModes = ['sword', 'axe', 'crystal', 'bedwars', 'fireballfight', 'nethpot', 'diapot'];

const dataDir = path.resolve('./data'); // Folder to store JSON files

// Make sure data folder exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function getFilePath(mode) {
  return path.join(dataDir, `${mode}.json`);
}

export default async function handler(req, res) {
  const mode = (req.query.mode || '').toLowerCase();

  if (!validModes.includes(mode)) {
    return res.status(400).json({ error: 'Invalid game mode' });
  }

  const filePath = getFilePath(mode);

  if (req.method === 'GET') {
    // Read the leaderboard data
    try {
      if (!fs.existsSync(filePath)) {
        // If file doesn't exist, create empty array
        fs.writeFileSync(filePath, JSON.stringify([]));
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
  } else if (req.method === 'POST') {
    // Check admin PIN
    const pin = req.headers['x-admin-pin'];
    if (pin !== ADMIN_PIN) {
      return res.status(403).json({ error: 'Unauthorized: Invalid PIN' });
    }

    // Validate body
    if (!req.body || !Array.isArray(req.body.leaderboard)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    // Save the leaderboard data
    try {
      fs.writeFileSync(filePath, JSON.stringify(req.body.leaderboard, null, 2));
      return res.status(200).json({ message: 'Leaderboard updated' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save data' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
