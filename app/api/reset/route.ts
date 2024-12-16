import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Write to db.json
    await writeFile(
      path.join(process.cwd(), 'db.json'),
      JSON.stringify(data, null, 2)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
} 