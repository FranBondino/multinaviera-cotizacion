import { NextResponse } from 'next/server';

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production';
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });

  response.cookies.set({
    name: 'almar_session',
    value: '',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}
