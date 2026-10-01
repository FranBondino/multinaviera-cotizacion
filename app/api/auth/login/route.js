import { NextResponse } from 'next/server';
import { validateCredentials, createSessionToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuario y contraseña requeridos' },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas. Verifique usuario y contraseña.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(username);

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({ success: true, message: 'Autenticación exitosa' });

    response.cookies.set({
      name: 'almar_session',
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno en el servidor de autenticación' },
      { status: 500 }
    );
  }
}
