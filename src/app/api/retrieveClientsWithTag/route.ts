import { NextRequest, NextResponse } from 'next/server';
import { retrieveClientsWithTag } from '@/actions/fields-message';

export async function POST(request: NextRequest) {
  try {
    const { fieldLabel, tagId } = await request.json(); 

    if (!fieldLabel) {
      return NextResponse.json({ error: 'Invalid fieldLabel' }, { status: 400 });
    }

    const clients = await retrieveClientsWithTag(fieldLabel, tagId);
    console.log(clients)
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
