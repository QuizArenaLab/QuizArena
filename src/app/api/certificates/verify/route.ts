import { NextResponse } from 'next/server';
import { certificateVerificationService } from '../../../../certificates/services/CertificateVerificationService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Certificate ID is required' }, { status: 400 });
  }

  try {
    const result = await certificateVerificationService.verifyCertificate(id);
    if (!result.valid) {
      return NextResponse.json({ error: result.reason }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Verify API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
