import { NextRequest, NextResponse } from 'next/server';
import { getTagsFromField } from '@/actions/fields-message';

export async function POST(request: NextRequest) {
  try {
    const { fieldId } = await request.json(); // Extract `fieldId` from the request body

    if (!fieldId) {
      return NextResponse.json({ error: 'Invalid fieldId' }, { status: 400 });
    }

    const tags = await getTagsFromField(fieldId);
    console.log(tags)
    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
