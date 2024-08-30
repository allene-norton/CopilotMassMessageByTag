import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/actions/fields-message';

export async function POST(request: NextRequest) {
  try {
    const { clients, messageContent, token } = await request.json(); 
    if (!clients) {
      return NextResponse.json({ error: 'Invalid client list' }, { status: 400 });
    }

    const messageRequest = await sendMessage(clients, messageContent, token);
    return NextResponse.json(messageRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
