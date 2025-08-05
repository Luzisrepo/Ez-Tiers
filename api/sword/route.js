import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const fileName = path.basename(__dirname) + '.json';
const dataFile = path.join(process.cwd(), 'data', path.basename(__dirname), fileName);

export async function GET() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newEntry = await request.json();
    const data = await fs.readFile(dataFile, 'utf8');
    const entries = JSON.parse(data);

    const exists = entries.some((e) => e.name === newEntry.name && e.tier === newEntry.tier);
    if (exists) return NextResponse.json({ error: 'Entry already exists.' }, { status: 400 });

    entries.push(newEntry);
    await fs.writeFile(dataFile, JSON.stringify(entries, null, 2));
    return NextResponse.json({ message: 'Entry added.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add entry.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { name, tier } = await request.json();
    const data = await fs.readFile(dataFile, 'utf8');
    let entries = JSON.parse(data);
    const originalLen = entries.length;

    entries = entries.filter((e) => e.name !== name || e.tier !== tier);
    if (entries.length === originalLen)
      return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });

    await fs.writeFile(dataFile, JSON.stringify(entries, null, 2));
    return NextResponse.json({ message: 'Entry deleted.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete entry.' }, { status: 500 });
  }
}
