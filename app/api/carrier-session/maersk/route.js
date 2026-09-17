import { NextResponse } from 'next/server';
import { getMaerskBrokerStatus, setMaerskSessionToken } from '../../../../lib/carriers/maerskCommercialBroker';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = getMaerskBrokerStatus();
  return NextResponse.json({
    success: true,
    carrier: 'Maersk Commercial Gateway',
    timestamp: new Date().toISOString(),
    status
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token o cookie de sesión requerida' },
        { status: 400 }
      );
    }

    const ok = setMaerskSessionToken(token);
    return NextResponse.json({
      success: ok,
      message: ok ? 'Sesión comercial Maersk activada exitosamente' : 'Error al establecer sesión',
      currentStatus: getMaerskBrokerStatus()
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
