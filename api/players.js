import { json } from '@vercel/node';

let db = {
  sword: [],
  axe: [],
  crystal: [],
  bedwars: [],
  fireball: [],
  nethpot: [],
  diapot: [],
};

export default function handler(req, res) {
  const mode = req.query.mode || 'sword';
  if (!db[mode]) return res.status(404).json({ error: "Invalid mode" });

  if (req.method === "GET") {
    res.status(200).json(db[mode]);
  } else if (req.method === "POST") {
    const { name, tier, score } = req.body;
    if (!name || !tier || typeof score !== "number") {
      return res.status(400).json({ error: "Missing player data" });
    }
    db[mode].push({ name, tier, score });
    res.status(201).json({ message: "Player added" });
  } else if (req.method === "PUT") {
    const { name, tier, score } = req.body;
    const player = db[mode].find(p => p.name === name);
    if (!player)
