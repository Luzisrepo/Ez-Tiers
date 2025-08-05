import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const dataFile = path.join(process.cwd(), 'data', 'tiers.json');

export async function GET() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read tiers data.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newTier = await request.json();
    const data = await fs.readFile(dataFile, 'utf8');
    const tiers = JSON.parse(data);

    const exists = tiers.some(
      (entry) => entry.name === newTier.name && entry.tier === newTier.tier
    );

    if (exists) {
      return NextResponse.json({ error: 'Tier already exists.' }, { status: 400 });
    }

    tiers.push(newTier);
    await fs.writeFile(dataFile, JSON.stringify(tiers, null, 2));
    return NextResponse.json({ message: 'Tier added successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add tier.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { name, tier } = await request.json();
    const data = await fs.readFile(dataFile, 'utf8');
    let tiers = JSON.parse(data);

    const initialLength = tiers.length;
    tiers = tiers.filter((entry) => entry.name !== name || entry.tier !== tier);

    if (tiers.length === initialLength) {
      return NextResponse.json({ error: 'Tier not found.' }, { status: 404 });
    }

    await fs.writeFile(dataFile, JSON.stringify(tiers, null, 2));
    return NextResponse.json({ message: 'Tier deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete tier.' }, { status: 500 });
  }
}
